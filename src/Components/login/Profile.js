import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeadTitle from "../../Common/HeadTitle/HeadTitle";
import "./design.css";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";

function Profile() {
  const idCustom = localStorage.getItem("idCustom");
  const idCustomObject = JSON.parse(idCustom);
  const userId = idCustom ? idCustomObject.id : null;

  // eslint-disable-next-line no-undef
  const [customer, setCustomer] = useState({
    id: "",
    fullname: "",
    gender: "",
    birthday: "",
    phoneNumber: "",
    email: "",
    citizenId: "",
    provinces: "",
    districts: "",
    wards: "",
    createAt: "",
  });

  // eslint-disable-next-line no-undef
  useEffect(() => {
    // Định nghĩa hàm fetchData bên trong useEffect
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:2003/api/home/detail/${userId}`
        );
        console.log("Customer", response.data);
        console.log(userId);

        if (response.data) {
          setCustomer(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    // Gọi hàm fetchData ngay lập tức
    fetchData();
  }, [userId]);

  // call api địa chỉ
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWards, setSelectedWards] = useState("");

  const [idProvince, setIdProvince] = useState(0);
  const [idDistrict, setIdDistrict] = useState(0);
  const [idWard, setIdWard] = useState(0);

  const [selectedProvinceName, setSelectedProvinceName] = useState("");
  const [selectedDistrictName, setSelectedDistrictName] = useState("");
  const [selectedWardName, setSelectedWardName] = useState("");
  const [proId, setProId] = useState();
  const findProvinceIdByName = (name) => {
    const province = provinces.find((p) => p.province_name === name);
    return province ? province.province_id : null;
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await axios.get(
        "https://vapi.vnappmob.com/api/province/"
      );
      setProvinces(response.data.results);
      const idP = response.data.results
        ? response.data.results.find(
            (p) => p.province_name === customer.provinces
          )
        : null;
      console.log(idP);
      const province = response.data.results.find(
        (p) => p.province_id === idP?.province_id
      );
      setSelectedProvince(province);
      setIdProvince(province?.province_id || 0);
      const name = province ? province.province_name : "";
      setSelectedProvinceName(name);
      if (province) {
        setDistricts([]);
        setWards([]);
      }
      console.log(province);
    };
    fetchProvinces();
  }, [customer.provinces, userId]);

  useEffect(() => {
    if (idProvince) {
      const fetchDistricts = async () => {
        const response = await axios.get(
          `https://vapi.vnappmob.com/api/province/district/${idProvince}`
        );
        setDistricts(response.data.results);
        const idD = response.data.results.find(
          (d) => d.district_name === customer.districts
        );
        setSelectedDistrict(idD?.district_id);
        const district = response.data.results.find(
          (d) => d.district_id === idD?.district_id
        );
        setIdDistrict(district?.district_id || 0);
        const name = district ? district.district_name : "";
        setSelectedDistrictName(name);
        if (district) {
          setWards([]);
        }
        console.log(district);
      };
      fetchDistricts();
    }
  }, [customer.districts, idProvince]);

  useEffect(() => {
    if (idDistrict) {
      const fetchWards = async () => {
        const response = await axios.get(
          `https://vapi.vnappmob.com/api/province/ward/${idDistrict}`
        );
        setWards(response.data.results);
        const ward = response.data.results.find(
          (w) => w.ward_name === customer.wards
        );
        setSelectedWards(ward?.ward_id);
        const name = ward ? ward.ward_name : "";
        setSelectedWards(name);
        setSelectedWardName(name);
      };
      fetchWards();
    }
  }, [customer.wards, idDistrict]);

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    console.log("ABC: ", selectedProvince);
    const province = provinces.find((p) => p.province_id === e.target.value);
    setIdProvince(province?.province_id || 0);
    const name = province ? province.province_name : "";
    setSelectedProvinceName(name);
    if (province) {
      setDistricts([]);
      setWards([]);
    }
    console.log(province);
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    const district = districts.find((d) => d.district_id === e.target.value);
    setIdDistrict(district?.district_id || 0);
    const name = district ? district.district_name : "";
    setSelectedDistrictName(name);
    if (district) {
      setWards([]);
    }
    console.log(district);
  };

  const handleWardsChange = (e) => {
    setSelectedWards(e.target.value);
    const ward = wards.find((w) => w.ward_id === e.target.value);
    setIdWard(ward?.ward_id || 0);
    const name = ward ? ward.ward_name : "";
    setSelectedWardName(name);
    console.log(ward);
  };

  const findDistrictIdByName = (name) => {
    const district = districts.find((d) => d.district_name === name);
    return district ? district.district_id : null;
  };

  const findWardIdByName = (name) => {
    const ward = wards.find((w) => w.ward_name === name);
    return ward ? ward.ward_id : null;
  };

  const selectedProvinceId = findProvinceIdByName(selectedProvinceName);
  const selectedDistrictId = findDistrictIdByName(selectedDistrictName);
  const selectedWardId = findWardIdByName(selectedWards);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (event) => {
    setCustomer((prev) => ({
      ...prev,
      gender: event.target.checked,
    }));
  };

  const handleSubmitButtonClick = (event) => {
    event.preventDefault();
  };

  //   console.log(gender);
  const handleSubmit = async (userId, customer) => {
    const payload = {
      ...customer,
      id: userId,
      fullname: customer?.fullname,
      gender: customer?.gender,
      email: customer?.email,
      phoneNumber: customer?.phoneNumber,
      birthday: customer?.birthday,
      citizenId: customer?.citizenId,
      provinces: selectedProvinceName,
      districts: selectedDistrictName,
      wards: selectedWardName,
    };
    console.log("payload ", payload);

    try {
      const response = await axios.put(
        `http://localhost:2003/api/home/update/${userId}`,
        payload
      );
      console.log(response);

      if (response.status === 200) {
        // Xử lý khi API thành công
        console.log("API call successful");

        window.location.href = "/";
        return true;
        // Thực hiện các hành động khác sau khi API thành công
      } else {
        // Xử lý khi API gặp lỗi
        console.log("API call failed");
        return false;
        // Thực hiện các hành động khác khi gọi API thất bại
      }
    } catch (error) {
      // Xử lý khi có lỗi xảy ra trong quá trình gọi API
      if (error.response) {
        // Xử lý response lỗi
        if (error.response.status === 400) {
          console.log(error.response.data);

          toast.error(error.response.data);
          const isFullnameError = error.response.data.fullname === undefined;
          const isEmailError = error.response.data.email === undefined;
          const isPhoneNumberError =
            error.response.data.phoneNumber === undefined;
          const isCitizenIdError = error.response.data.citizenId === undefined;
          const isBirthdayError = error.response.data.birthday === undefined;
          const isProvinceError = error.response.data.provinces === undefined;
          const isDistrictError = error.response.data.districts === undefined;
          const isWardError = error.response.data.wards === undefined;

          if (
            !isFullnameError &&
            !isEmailError &&
            !isPhoneNumberError &&
            !isCitizenIdError &&
            !isBirthdayError &&
            !isProvinceError &&
            !isDistrictError &&
            !isWardError
          ) {
            toast.error(error.response.data.fullname, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
            toast.error(error.response.data.email, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
            toast.error(error.response.data.phoneNumber, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
            toast.error(error.response.data.citizenId, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
            toast.error(error.response.data.birthday, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
            toast.error(error.response.data.provinces, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
            toast.error(error.response.data.districts, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
            toast.error(error.response.data.wards, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
            return false;
          } else {
            // Nếu có ít nhất một trường bị thiếu, xóa thông báo lỗi cho trường đó nếu có
            // và hiển thị thông báo lỗi cho các trường còn lại
            if (!isFullnameError) {
              toast.error(error.response.data.fullname, {
                position: toast.POSITION.BOTTOM_RIGHT,
              });
            }
            if (!isEmailError) {
              toast.error(error.response.data.email, {
                position: toast.POSITION.BOTTOM_RIGHT,
              });
            }
            if (!isPhoneNumberError) {
              toast.error(error.response.data.phoneNumber, {
                position: toast.POSITION.BOTTOM_RIGHT,
              });
            }
            if (!isCitizenIdError) {
              toast.error(error.response.data.citizenId, {
                position: toast.POSITION.BOTTOM_RIGHT,
              });
            }
            if (!isBirthdayError) {
              toast.error(error.response.data.birthday, {
                position: toast.POSITION.BOTTOM_RIGHT,
              });
            }
            if (!isProvinceError) {
              toast.error(error.response.data.provinces, {
                position: toast.POSITION.BOTTOM_RIGHT,
              });
            }
            if (!isDistrictError) {
              toast.error(error.response.data.districts, {
                position: toast.POSITION.BOTTOM_RIGHT,
              });
            }
            if (!isWardError) {
              toast.error(error.response.data.wards, {
                position: toast.POSITION.BOTTOM_RIGHT,
              });
            }
            return false;
          }
        } else {
          alert("Có lỗi xảy ra trong quá trình gọi API");
          return false;
        }
      } else {
        console.log("Không thể kết nối đến API");
        return false;
      }
    }
  };

  return (
    <div className={"wrapper"}>
      <h1>Cập Nhật Thông Tin </h1>

      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="fullname"
          value={customer.fullname}
          onChange={(e) => {
            setCustomer((prev) => ({
              ...prev,
              fullname: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Họ tên</label>
      </div>
      <br></br>
      <div className="form-floating mb-3">
        <div className="mb-3 row">
          <label htmlFor="staticEmail" className="col-sm-1 col-form-label">
            Giới tính
          </label>
          <div className="col-sm-10">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                value="true"
                defaultChecked
                checked={customer.gender === true}
                onChange={(e) => {
                  setCustomer((prev) => ({
                    ...prev,
                    gender: e.target.value === "true",
                  }));
                }}
              />
              <label className="form-check-label" htmlFor="inlineRadio1">
                Nam
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                value="false"
                checked={customer.gender === false}
                onChange={(e) => {
                  setCustomer((prev) => ({
                    ...prev,
                    gender: e.target.value === "true",
                  }));
                }}
              />
              <label className="form-check-label" htmlFor="inlineRadio2">
                Nữ
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="form-floating">
        <input
          type="date"
          className="form-control"
          id="floatingBirthday"
          placeholder="Ngày sinh"
          name="birthday"
          value={customer.birthday ? customer.birthday.slice(0, 10) : null}
          onChange={(e) => {
            setCustomer((prev) => ({
              ...prev,
              birthday: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingBirthday">Ngày sinh</label>
      </div>

      <br></br>
      <div className="form-floating mb-3">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="email"
          value={customer.email}
          onChange={(e) => {
            setCustomer((prev) => ({
              ...prev,
              email: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingInput">Email</label>
      </div>
      <div className="form-floating">
        <input
          type="tel"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="phoneNumber"
          value={customer.phoneNumber}
          onChange={(e) => {
            setCustomer((prev) => ({
              ...prev,
              phoneNumber: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Số điện thoại</label>
      </div>
      <br></br>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="citizenId"
          value={customer.citizenId}
          onChange={(e) => {
            setCustomer((prev) => ({
              ...prev,
              citizenId: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Căn cước công dân</label>
      </div>

      <br></br>
      <p>Tỉnh/Thành Phố</p>
      <select
        className="form-select"
        name="provinces"
        value={selectedProvinceId} // Sử dụng giá trị đã tìm thấy
        onChange={handleProvinceChange}
      >
        <option value="">Chọn tỉnh thành</option>
        {provinces.map((province) => (
          <option key={province.province_id} value={province.province_id}>
            {province.province_name}
          </option>
        ))}
      </select>
      <br></br>
      {/* Tạo ô select cho quận/huyện */}
      <p>Quận/Huyện</p>
      <select
        className="form-select"
        name="districts"
        value={selectedDistrictId} // Sử dụng giá trị đã tìm thấy
        onChange={handleDistrictChange}
      >
        <option value="">Chọn quận huyện</option>
        {districts.map((district) => (
          <option key={district.district_id} value={district.district_id}>
            {district.district_name}
          </option>
        ))}
      </select>

      <br></br>
      {/* Tạo ô select cho phường/xã */}
      <p>Phường/Xã</p>
      <select
        className="form-select"
        name="wards"
        value={selectedWardId} // Sử dụng giá trị đã tìm thấy
        onChange={handleWardsChange}
      >
        <option value="">Chọn phường xã</option>
        {wards.map((ward) => (
          <option key={ward.ward_id} value={ward.ward_id}>
            {ward.ward_name}
          </option>
        ))}
      </select>
      <br></br>
      <button
        className={("input-btn", "btn btn-primary")}
        onClick={() => {
          Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Update it!",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const isSubmitSuccess = await handleSubmit(userId, customer);
              if (isSubmitSuccess) {
                Swal.fire("Update!", "Your data has been Update.", "success");
                toast.success("Update Successfully!");
              }
            }
          });
        }}
      >
        Cập nhật
      </button>
      <ToastContainer />
    </div>
  );
}

export default Profile;
