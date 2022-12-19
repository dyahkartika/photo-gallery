import { useEffect } from "react";
import { useState } from "react";
import Card from "../components/Card";

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [sort, setSort] = useState("asc");
  const [submited, setSubmited] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error] = useState(null);

  const deletePhoto = async (id) => {
    await fetch(`http://localhost:3001/photos/${id}`, {
      method: "DELETE"
    })
    setPhotos(photos.filter((img) => img.id !==id));
  };

  useEffect(() => {
    setLoading(true);
    if(submited){
      const submitData = async () => {
        try{
          const response = await fetch(`http://localhost:3001/photos?q=${submited}`);
          const responseJson = await response.json();
          setPhotos(responseJson);
          setLoading(false)
        } catch (error) {
          console.log(error);
        }
      }
      submitData()
    }

    if(sort){
      const sortData = async () => {
        try{
          const response = await fetch(`http://localhost:3001/photos?_sort=id&_order=${sort}`);
          const responseJson = await response.json();
          setPhotos(responseJson);
          setLoading(false)
        } catch (error) {
          console.log(error);
        }
      }
      sortData();
    }

    if(search){
      const searchData = async () => {
        try{
          const response = await fetch(`http://localhost:3001/photos?q=${search}`);
          const responseJson = await response.json();
          setPhotos(responseJson);
          setLoading(false)
        } catch (error) {
          console.log(error);
        }
      }
      searchData();
    }

  }, [submited, sort, search]);

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      try{
        const response = await fetch("http://localhost:3001/photos");
        const responseJson = await response.json();
        setPhotos(responseJson);
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    }
    loadData()
  }, []);

  if (error) return <h1 style={{ width: "100%", textAlign: "center", marginTop: "20px" }} >Error!</h1>;

  return (
    <>
      <div className="container">
        <div className="options">
          <select
            onChange={(e) => setSort(e.target.value)}
            data-testid="sort"
            className="form-select"
            style={{}}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmited(search);
            }}
          >
            <input
              type="text"
              data-testid="search"
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
            />
            <input
              type="submit"
              value="Search"
              data-testid="submit"
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
            photos.map((photo) => {
              return (
                <Card key={photo.id} photo={photo} deletePhoto={deletePhoto} />
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Photos;
