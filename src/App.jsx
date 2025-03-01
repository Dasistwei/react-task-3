import { useEffect, useState } from "react";
import axios from "axios";
function ProductPage({ token }) {
  const [tempProduct, setTempProduct] = useState(null);
  const [products, setProducts] = useState([]);

  function getProducts() {
    const API_URL = `${API_BASE}/api/${API_PATH}/admin/products`;
    const TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6IlFEZ1JhQSJ9...（省略）...";

    axios
      .get(API_URL, {
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        console.log("✅ 產品列表：", response.data.products);
        setProducts(response.data.products);
      })
      .catch((error) => {
        console.error(
          "❌ 請求錯誤:",
          error.response ? error.response.data : error.message
        );
      });
  }
  useEffect(() => {
    getProducts();
  }, []);
  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-md-6">
          <h2>產品列表</h2>
          <table className="table">
            <thead>
              <tr>
                <th>產品名稱</th>
                <th>原價</th>
                <th>售價</th>
                <th>是否啟用</th>
                <th>查看細節</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.origin_price}</td>
                  <td>{item.price}</td>
                  <td>{item.is_enabled ? "啟用" : "不啟用"}</td>

                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => setTempProduct(item)}
                    >
                      查看細節
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="col-md-6">
            <h2>單一產品細節</h2>
            {tempProduct ? (
              <div className="card mb-3">
                <img
                  src={tempProduct.imageUrl}
                  className="card-img-top primary-image"
                  alt="主圖"
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {tempProduct.title}
                    <span className="badge bg-primary ms-2">
                      {tempProduct.category}
                    </span>
                  </h5>
                  <p className="card-text">
                    商品描述：{tempProduct.description}
                  </p>
                  <p className="card-text">商品內容：{tempProduct.content}</p>
                  <div className="d-flex">
                    <p className="card-text text-secondary">
                      <del>{tempProduct.origin_price}</del>
                    </p>
                    元 / {tempProduct.price} 元
                  </div>
                  <h5 className="mt-3">更多圖片：</h5>
                  <div className="d-flex flex-wrap">
                    {tempProduct.imagesUrl.map((url, index) => {
                      return (
                        <img
                          key={index}
                          src={url}
                          className="img-thumbnail me-2 w-25"
                          alt="其他圖片"
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-secondary">請選擇一個商品查看</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
const API_PATH = import.meta.env.VITE_API_PATH;
const API_BASE = import.meta.env.VITE_API_BASE;
function App() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(false);
  const [token, setToken] = useState("");

  function login() {
    axios
      .post(`${API_BASE}/admin/signin`, {
        username: user.username,
        password: user.password,
      })
      .then((response) => {
        console.log(response.data);
        setIsLogin(true);
        setToken(response.data.token);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleClick(e) {
    e.preventDefault();
    login();
  }
  return (
    <>
      {isLogin ? (
        <ProductPage token={token} />
      ) : (
        <div className="container">
          <form>
            <fieldset>
              <legend>登入</legend>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  onChange={(e) => {
                    setUser({
                      ...user,
                      username: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  onChange={(e) => {
                    setUser({
                      ...user,
                      password: e.target.value,
                    });
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleClick}
              >
                Submit
              </button>
            </fieldset>
          </form>
        </div>
      )}
    </>
  );
}

export default App;
