import "./App.css";
import { Model } from "./model";
import { ImageGallery } from "./components/imageGallery/ImageGallery";
import { fakeImageData } from "./fakeData";

function App() {
  const model = new Model(fakeImageData, "2");

  return (
    <div>
      <ImageGallery model={model} />
    </div>
  );
}

export default App;
