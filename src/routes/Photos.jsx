import { useEffect, useRef } from "react";
import { useState } from "react";
import Card from "../components/Card";
import { getPhotoGallery, deletePhoto } from "../services";
import { useSearchParams } from "react-router-dom";

const Pagination = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  const moveTo = (direction) => {
    const currentParams = searchParams.getAll();
    if (direction === "prev") {
    setSearchParams({ ...currentParams, page: currentPage - 1 });
    setCurrentPage(currentPage - 1);
  } else if (direction === "next") {
    setSearchParams({ ...currentParams, page: currentPage + 1 });
    setCurrentPage(currentPage + 1);
  }
  };
  useEffect(() => {
    const currentPage = parseInt(searchParams.get("page") || 1);
    setCurrentPage(currentPage);
  }, [searchParams]);

  return (
    <>
      {currentPage === 1 ? <button disabled colorScheme='red'>Prev</button> : <button onClick={() => moveTo("prev")} colorScheme="green">Prev</button>}
      <button onClick={() => moveTo("next")} colorScheme='green'>Next</button>
    </>
  );
};

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [filteredPhoto, setFilteredPhoto] = useState([]);
  const [sort, setSort] = useState("asc");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const queryPhotos = async () => {
    setLoading(true);
    const collection = await getPhotoGallery(sort);
    setPhotos(collection);
    setLoading(false);
  };

  const searchPhoto = () => {
    const search = inputRef.current.value;
    if (!search) {
      setFilteredPhoto([]);
      return queryPhotos();
    }

    const collections = photos.filter((photo) => {
      const captions = photo.captions ? photo.captions.toLowerCase() : "";
      const desc = photo.desc ? photo.desc.toLowerCase() : "";
      const keywords = photo.keywords ? photo.keywords.toLowerCase() : "";
      const substr = search.toLowerCase();
      return captions.includes(substr) || desc.includes(substr) || keywords.includes(substr);
    });

    const sortedCollections = collections.sort((a, b) => {
    const captionA = a.captions ? a.captions.toLowerCase() : "";
    const captionB = b.captions ? b.captions.toLowerCase() : "";
    return sort === "asc"
      ? captionA.localeCompare(captionB)
      : captionB.localeCompare(captionA);
  });

    setFilteredPhoto(sortedCollections);
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
  }, []);

  return (
    <>
      <div className="container-photos">
        <div className="options">
          <select
            onChange={(e) => setSort(e.target.value)}
            data-testid="sort"
            className="form-select"
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
              data-testid="search"
              className="form-input"
              onClick={searchPhoto}
            />
            <input type="submit" value="Search" data-testid="submit" className="form-btn" />
          </form>
        </div>
        <Pagination />
        <div className="content">
          {loading ? (
            <h1 style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>Loading...</h1>
          ) : photos.length ? (
            filteredPhoto.length && inputRef.current.value.length ? (
              filteredPhoto.length ? (
                filteredPhoto.map((photo) => (
                  <Card
                    key={photo.id}
                    photo={photo}
                    deletePhoto={() => deleting(photo.id)}
                    className="card"
                  />
                ))
              ) : (
                <div style={{ margin: "100px auto", textAlign: "center" }}>
                  <p>Data tidak ditemukan</p>
                </div>
              )
            ) : (
              photos.map((photo) => (
                <Card
                  key={photo.id}
                  photo={photo}
                  deletePhoto={() => deleting(photo.id)}
                  className="card"
                />
              ))
            )
          ) : (
            <div style={{ margin: "100px auto", textAlign: "center" }}>
              <p>Data tidak ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Photos;
