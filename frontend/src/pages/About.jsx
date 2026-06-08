import image4 from "../assets/image4.jpg";
import image5 from "../assets/image5.jpg";

const About = () => {
  return (
    <main className="bg-[#ffbf8b] text-black">
      <section>
        <img
          src={image4}
          alt="Couple walking together"
          className="h-[520px] w-full object-cover"
        />
      </section>

      <section className="px-6 py-20 text-center">
        <h1 className="text-4xl font-bold mb-10">
          What is DAYate?
        </h1>

        <div className="mx-auto max-w-6xl text-2xl leading-relaxed">
          <p>
            Sometimes we want to do something special for the people we love,
            but busy schedules and endless planning can make it harder than it
            should be.
          </p>

          <p className="mt-4">
            Planning a meaningful day often means switching between multiple
            websites, businesses, and bookings just to make one idea come
            together.
          </p>

          <p className="mt-5">
            <span className="font-bold text-[#b21d2a]">DAYate</span> brings
            everything into one place.
          </p>

          <p className="mt-12">
            You choose the experience. We help simplify the process.
          </p>

          <p className="mt-12">
            Less time managing tabs and logistics. More time focusing on what
            matters.
            Because love isn't measured by how perfectly a day is planned. It's measured by the effort, the thought, and the feeling of knowing someone went out of their way to make you feel special.
          </p>
        </div>
      </section>

      <section>
        <img
          src={image5}
          alt="Couple sitting together"
          className="h-[380px] w-full object-cover"
        />

        <div className="px-6 py-8 text-center text-2xl italic leading-relaxed">
          <p>Because sometimes the most important thing you can say is:</p>
          <p className="mt-2">"I was thinking about you." ❤️</p>
        </div>
      </section>
    </main>
  );
};

export default About;