import heroImage from './assets/images/hero.png';
import guide1 from './assets/images/Guide1.jpg';
import guide2 from './assets/images/Guide2.jpg';
import guide3 from './assets/images/Guide3.jpg';

const ImportFileSteps = ({ importChat }) => (
  <div className="font-content bg-dark text-white px-32 pt-12">
    <img src={heroImage} alt="Hero" className="absolute top-48 right-72" />
    <main className="relative">
      <h1
        className="font-black leading-7 
  mb-12 text-title"
      >
        <span className="text-primaryDark">Whats</span>Viz
      </h1>
      <p className="text-content leading-7 w-3/4 h-1/5 mb-20">
        WhatsViz is a free and open-source website where you can get fun
        insights and statistics from your Whatsapp chat data, accompanied by
        awesome visualizations.
      </p>
      <label
        className="font-extrabold text-black text-content
         bg-white px-8 py-2 rounded-md border-4 border-primary cursor-pointer"
      >
        <span>IMPORT CHAT</span>
        <input type="file" onChange={importChat} className="hidden" />
      </label>
      <div className="w-1/2 h-2/4 bg-white mt-20">
        <h2 className="bg-primary text-black text-content py-3 px-6 font-semibold">
          Your data is safe
        </h2>
        <div className="text-black font-light px-6 py-3 banner-content">
          <p>
            Whatsapp allows users to &nbsp;
            <a href="#how-to" className="underline text-accent100">
              export chat history
            </a>
            &nbsp; as a *.txt file. WhatsViz parses and analyses this data on
            the client side (i.e
            <span className="bg-accent font-semibold">
              your chat data never leaves your browser
            </span>
            ), to create meaningful visualizations
          </p>
          <p className="mt-8">No data is saved on any server.</p>
        </div>
      </div>
    </main>
    <h1 id="how-to" className="text-heading-2 mt-12 font-extrabold leading-8">
      How to export your chat history
    </h1>
    <div className="flex flex-wrap gap-11 mt-8">
      <div className=" bg-white" style={{ maxWidth: '300px' }}>
        <img src={guide1} alt="guide 1" />
      </div>
      <div className=" bg-white" style={{ maxWidth: '300px' }}>
        <img src={guide2} alt="guide 2" />
      </div>
      <div className="  bg-white" style={{ maxWidth: '300px' }}>
        <img src={guide3} alt="guide 3" />
      </div>
    </div>
    <div className="text-md font-light leading-7 my-10 max-w-md">
      Follow the steps and save the *.txt WhatsApp chat log file using your
      preferred method. Then import the log to WhatsViz to see the
      visualizations
    </div>
    <label
      className="font-extrabold text-black text-content
      bg-white px-8 py-2 rounded-md border-4 border-primary cursor-pointer
      "
    >
      <span>IMPORT CHAT</span>
      <input type="file" onChange={importChat} className="hidden" />
    </label>
    <footer
      className="flex border-t-2 
  font-light justify-between items-center
  text-xs py-4 gap-14 mt-10"
    >
      <div className="flex-shrink-0">2021 © WhatsViz</div>
      <div className="flex-shrink">
        WhatsApp is a registered trademark of Facebook, Inc. This site and
        service are not related in any way to Facebook Inc.
      </div>
      <div className="flex-shrink-0">Privacy Policy</div>
    </footer>
  </div>
);
export default ImportFileSteps;
