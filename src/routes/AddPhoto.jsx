import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToGallery } from "../services";

const AddPhoto = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [captions, setCaptions] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addPhoto = async (e) => {

    e.preventDefault();

    if(!(imageUrl || captions || desc)) return alert('Please fill empty field');

    setLoading(true)

    try {
      await addToGallery({ imageUrl,captions,desc })
      alert("add photo to gallery success");
      navigate('/photos');
    } 
    catch (error) {
      alert("add photo to gallery failed");
    }

    return setLoading(false);

  };

  return (
      <div className="container">
        <form className="add-form"  onSubmit={addPhoto}>
          <label>
            Image Url:
            <input
              className="add-input"
              type="text"
              data-testid="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </label>
          <label>
            Captions:
            <input
              className="add-input"
              type="text"
              data-testid="captions"
              value={captions}
              onChange={(e) => setCaptions(e.target.value)}
            />
          </label>
          <label>
            Description:
            <input
              className="add-input"
              type="text"
              data-testid="desc"
              value={desc}
              maxLength={200}
              onChange={(e) => setDesc(e.target.value)}
            />
          </label>
          <input 
          className="submit-btn"
          type="submit"
          disabled={loading}
          value={loading ? "Adding..." : "Add photo"}
          data-testid="submit"
          />
        </form>
      </div>
  );
};

export default AddPhoto;
