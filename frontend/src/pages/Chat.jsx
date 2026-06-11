import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, Send } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "https://dayate-zw7n.onrender.com";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);
  const imageInputRef = useRef(null);
  const token = localStorage.getItem("token");

  const selectedPlan = chats.find((plan) => plan._id === selectedPlanId);

  const fetchMessages = useCallback(async (planId, quiet = false) => {
    if (!planId) return;

    try {
      const response = await fetch(`${API}/api/chat/${planId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success) {
        setMessages(data.data);
        if (!quiet) setError("");
      } else if (!quiet) {
        setError(data.message);
      }
    } catch {
      if (!quiet) setError("Could not load messages");
    }
  }, [token]);

  useEffect(() => {
    const loadChat = async () => {
      try {
        const [chatsResponse, profileResponse] = await Promise.all([
          fetch(`${API}/api/chat`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API}/api/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const [chatsData, profileData] = await Promise.all([
          chatsResponse.json(),
          profileResponse.json(),
        ]);

        if (chatsData.success) {
          setChats(chatsData.data);
          setSelectedPlanId((current) => current || chatsData.data[0]?._id || "");
        } else {
          setError(chatsData.message);
        }

        if (profileData.success) setCurrentUser(profileData.user);
      } catch {
        setError("Could not connect to chat");
      }
    };

    loadChat();
  }, [token]);

  useEffect(() => {
    if (!selectedPlanId) return undefined;

    const initialLoad = window.setTimeout(
      () => fetchMessages(selectedPlanId),
      0
    );
    const poll = window.setInterval(
      () => fetchMessages(selectedPlanId, true),
      4000
    );

    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(poll);
    };
  }, [fetchMessages, selectedPlanId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if ((!text.trim() && !image) || !selectedPlanId || sending) return;

    const body = new FormData();
    if (text.trim()) body.append("text", text.trim());
    if (image) body.append("image", image);

    setSending(true);
    setError("");

    try {
      const response = await fetch(`${API}/api/chat/${selectedPlanId}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      const data = await response.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      setMessages((current) => [...current, data.data]);
      setText("");
      setImage(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
    } catch {
      setError("Could not send message");
    } finally {
      setSending(false);
    }
  };

  const selectImage = (event) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setImage(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      event.target.value = "";
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("Image must be smaller than 8 MB");
      event.target.value = "";
      return;
    }

    setError("");
    setImage(file);
  };

  const partnerName = (plan) => {
    if (!plan || !currentUser) return "Loved one";
    return plan.createdBy?._id === currentUser._id
      ? plan.partner?.name
      : plan.createdBy?.name;
  };

  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-4xl font-black">Share & Chat</h1>
        <p className="mb-8 text-slate-600">
          Chat with your loved one and see every update to your shared dates.
        </p>

        {error && (
          <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-red-700">
            {error}
          </p>
        )}

        <div className="grid min-h-[620px] overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-xl lg:grid-cols-[280px_1fr]">
          <aside className="border-b border-orange-100 bg-orange-50 p-4 lg:border-b-0 lg:border-r">
            <h2 className="mb-3 px-2 font-bold text-slate-900">Shared dates</h2>
            <div className="space-y-2">
              {chats.map((plan) => (
                <button
                  key={plan._id}
                  type="button"
                  onClick={() => setSelectedPlanId(plan._id)}
                  className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                    selectedPlanId === plan._id
                      ? "bg-[#ff9847] text-white"
                      : "bg-white text-slate-800 hover:bg-orange-100"
                  }`}
                >
                  <span className="block font-semibold">{plan.name}</span>
                  <span className="block text-xs opacity-80">
                    with {partnerName(plan)}
                  </span>
                </button>
              ))}
              {chats.length === 0 && (
                <p className="px-2 text-sm text-slate-500">
                  Share a finalized date with a registered DAYate user to start
                  chatting.
                </p>
              )}
            </div>
          </aside>

          <div className="flex min-h-[620px] flex-col">
            {selectedPlan ? (
              <>
                <header className="border-b border-orange-100 px-6 py-4">
                  <h2 className="text-xl font-bold">{selectedPlan.name}</h2>
                  <p className="text-sm text-slate-500">
                    {new Date(selectedPlan.date).toLocaleDateString()} ·{" "}
                    {selectedPlan.status}
                  </p>
                </header>

                <div ref={scrollRef} className="flex-1 space-y-4 overflow-auto p-6">
                  {messages.map((message) => {
                    if (message.type === "system") {
                      return (
                        <p
                          key={message._id}
                          className="mx-auto w-fit rounded-full bg-slate-100 px-4 py-2 text-center text-xs text-slate-600"
                        >
                          {message.text}
                        </p>
                      );
                    }

                    const isMine = message.sender?._id === currentUser?._id;
                    return (
                      <div
                        key={message._id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl p-3 ${
                            isMine
                              ? "bg-[#ff9847] text-white"
                              : "bg-orange-100 text-slate-900"
                          }`}
                        >
                          {!isMine && (
                            <p className="mb-1 text-xs font-semibold opacity-70">
                              {message.sender?.name}
                            </p>
                          )}
                          {message.imageUrl && (
                            <img
                              src={message.imageUrl}
                              alt="Shared in chat"
                              className="mb-2 max-h-80 rounded-xl object-cover"
                            />
                          )}
                          {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={sendMessage} className="border-t border-orange-100 p-4">
                  {image && (
                    <div className="mb-3 flex items-center justify-between rounded-xl bg-orange-50 px-4 py-2 text-sm">
                      <span className="truncate">{image.name}</span>
                      <button type="button" onClick={() => setImage(null)}>
                        Remove
                      </button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      value={text}
                      onChange={(event) => setText(event.target.value)}
                      placeholder="Type a message"
                      className="min-w-0 flex-1 rounded-full border border-orange-200 px-5 py-3 outline-none focus:border-orange-400"
                    />
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={selectImage}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="rounded-full border border-orange-200 p-3 text-orange-600 hover:bg-orange-50"
                      aria-label="Add image"
                    >
                      <ImagePlus size={22} />
                    </button>
                    <button
                      type="submit"
                      disabled={sending || (!text.trim() && !image)}
                      className="rounded-full bg-[#ff9847] p-3 text-white disabled:opacity-50"
                      aria-label="Send message"
                    >
                      <Send size={22} />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="m-auto max-w-md p-8 text-center text-slate-500">
                Your shared date conversations will appear here.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chat;
