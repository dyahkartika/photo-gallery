import { useEffect, useRef } from "react";
import { useState } from "react";
import Card from "../components/Card";
import { getPhotoGallery, deletePhoto } from "../services";

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [filteredPhoto, setFilteredPhoto] = useState([]);
  const [sort, setSort] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(4); // Jumlah item per halaman, sesuaikan dengan kebutuhan
  const inputRef = useRef();

  const queryPhotos = async () => {
    setLoading(true);
    const collection = await getPhotoGallery(sort, '', currentPage);
    setPhotos(collection);
    setLoading(false);
  };

  const searchPhoto = () => {
    const search = inputRef.current.value.toLowerCase();
    const filtered = photos.filter((photo) => {
      const captions = photo.captions ? photo.captions.toLowerCase() : "";
      const desc = photo.desc ? photo.desc.toLowerCase() : "";
      const keywords = photo.keywords ? photo.keywords.toLowerCase() : "";
      return (
        captions.includes(search) ||
        desc.includes(search) ||
        keywords.includes(search)
      );
    });
    setFilteredPhoto(filtered);
    setCurrentPage(1);
    queryPhotos();
  };

  const deleting = async (id) => {
    try {
      await deletePhoto(id);
      alert("Delete photo success");
      queryPhotos();
    } catch (error) {
      alert("Delete photo failed");
    }
  };

  useEffect(() => {
    queryPhotos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, currentPage]); // Menambahkan dependency sort dan currentPage agar queryPhotos dipanggil ulang saat terjadi perubahan

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastPhoto = currentPage * perPage;
  const indexOfFirstPhoto = indexOfLastPhoto - perPage;

  const currentPhotos = filteredPhoto.slice(indexOfFirstPhoto, indexOfLastPhoto);

  return (
    <>
      <div className="container-photos">
        <div className="options">
          <select
            onChange={(e) => setSort(e.target.value)}
            className="form-select"
            style={{}}
          >
            <option value="asc">Oldest</option>
            <option value="desc">Latest</option>
          </select>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              searchPhoto();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="form-input"
              onClick={searchPhoto}
            />
            <input
              type="submit"
              value="Search"
              className="form-btn"
            />
          </form>
        </div>
        <div className="content">
          {loading ? (
            <h1
              style={{ width: "100%", textAlign: "center", marginTop: "20px" }}
            >
              Loading...
            </h1>
          ) : (
            <>
              {currentPhotos && currentPhotos.length > 0 ? (
                currentPhotos.map((photo) => (
                  <Card
                    key={photo.id}
                    photo={photo}
                    deletePhoto={() => deleting(photo.id)}
                  />
                ))
              ) : (
                <div style={{ margin: "100px auto", textAlign: "center" }}>
                  <p>Data tidak ditemukan</p>
                </div>
              )}
            </>
          )}
        </div>
        <div className="pagination">
         {currentPage > 1 && (
            <button onClick={() => paginate(currentPage - 1)}>Prev</button>
          )}
          {currentPhotos.length > 0 && (
            <button onClick={() => paginate(currentPage + 1)}>Next</button>
          )}
        </div>
      </div>
    </>
  );
};

export default Photos;