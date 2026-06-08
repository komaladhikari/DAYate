import { Mail, Phone, MapPin, User, Tag, Pencil, Send, Lock } from "lucide-react";
import image6 from "../assets/image6.jpg"; 

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#ffbf8b] text-[#020818]">
      <main className="px-16 py-10">
        <section className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden rounded-3xl shadow-2xl lg:grid-cols-2">
          <div className="relative overflow-hidden bg-[#ff9148] p-14">
            <p className="mb-8 tracking-[0.45em] font-bold text-sm">
              GET IN TOUCH
            </p>

            <h1 className="max-w-md text-6xl font-extrabold leading-tight">
              We'd love to hear from you.
            </h1>

            <div className="my-7 h-1 w-16 bg-[#020818]" />

            <p className="max-w-sm text-lg leading-8">
              Have a question, suggestion, or just want to say hello? We’re here
              for you. Drop us a message and we’ll get back as soon as possible.
            </p>

            <div className="relative z-10 mt-10 space-y-6">
              <Info icon={<Mail size={22} />} title="Email" text="hello@dayate.app" />
              <Info icon={<Phone size={22} />} title="Phone" text="+1 (555) 123-4567" />
              <Info
                icon={<MapPin size={22} />}
                title="Address"
                text="123 Love Lane, San Francisco, CA 94107"
              />
            </div>

            <img
              src={image6}
              alt="Couple sitting together"
              className="absolute inset-x-0 bottom-0 h-[48%] w-full object-cover object-center opacity-70"
            />
          </div>

          <form className="!m-0 !max-w-none !rounded-none !border-0 !bg-white p-14">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <Input label="First name *" icon={<User size={18} />} placeholder="Your first name" />
              <Input label="Last name *" icon={<User size={18} />} placeholder="Your last name" />
            </div>

            <Input
              className="mt-10"
              label="Email *"
              icon={<Mail size={18} />}
              placeholder="you@example.com"
            />

            <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
              <Input label="Phone" icon={<Phone size={18} />} placeholder="Your phone number" />
              <Input label="Subject" icon={<Tag size={18} />} placeholder="What's this about?" />
            </div>

            <div className="mt-10">
              <label className="font-semibold">Message *</label>
              <div className="mt-5 flex items-start gap-4 border-b border-[#ff9148] pb-4">
                <Pencil size={18} className="mt-1 text-[#ff9148]" />
                <textarea
                  rows="5"
                  placeholder="Write your message here..."
                  className="w-full resize-none bg-transparent outline-none placeholder:text-gray-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-10 flex full items-center justify-center gap-3 rounded-xl bg-[#020818] py-5 text-lg font-bold text-white shadow-lg transition hover:scale-[1.01]"
            >
              Send message <Send size={15} />
            </button>

            <p className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Lock size={14} />
              We respect your privacy. Your information is safe with us.
            </p>
          </form>
        </section>
      </main>
    </div>
  );
};

const Info = ({ icon, title, text }) => (
  <div className="flex items-start gap-5">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#020818] text-[#ff9148]">
      {icon}
    </div>
    <div>
      <h3 className="font-bold">{title}</h3>
      <p className="max-w-xs">{text}</p>
    </div>
  </div>
);

const Input = ({ label, icon, placeholder, className = "" }) => (
  <div className={className}>
    <label className="font-semibold">{label}</label>
    <div className="mt-5 flex items-center gap-4 border-b border-[#ff9148] pb-4">
      <span className="text-[#ff9148]">{icon}</span>
      <input
        placeholder={placeholder}
        className="w-full bg-transparent outline-none placeholder:text-gray-500"
      />
    </div>
  </div>
);

export default Contact;
