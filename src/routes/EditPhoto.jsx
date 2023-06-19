import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getPhotoByID, updatePhoto } from "../services";

const EditPhoto = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [captions, setCaptions] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const getDetailPhoto = async () => {
    setLoading(true);

    try {
      const docPhoto = await getPhotoByID(id);
      setImageUrl(docPhoto.imageUrl);
      setCaptions(docPhoto.captions);
      setDesc(docPhoto.desc);
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  const editPhoto = async (e) => {
    e.preventDefault();

    setLoading(true);
    
    try {
      await updatePhoto(id, { imageUrl, captions, desc });
      alert("update photo success");
      navigate("/photos");
    } catch (error) {
      alert("update photo failed");
    }

    setLoading(false);

  };

  useEffect(() => {
    getDetailPhoto();
  }, [id]);

  return (
    <>
      {loading ? (
        <h1 style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>
          Loading...
        </h1>
      ) : (
        <div className="container">
          <form className="edit-form" onSubmit={editPhoto}>
            <label>
              Image Url:
              <input
                className="edit-input"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </label>
            <label>
              Captions:
              <input
                className="edit-input"
                type="text"
                value={captions}
                data-testid="captions"
                onChange={(e) => setCaptions(e.target.value)}
              />
            </label>
            <label>
              Description:
              <input
                className="edit-input"
                type="text"
                value={desc}
                data-testid="desc"
                onChange={(e) => setDesc(e.target.value)}
              />
            </label>
            <input className="submit-btn" type="submit" value="Submit" data-testid="submit" />
          </form>
        </div>
      )}
    </>
  );
};

export default EditPhoto;
