import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import { Scrollbar } from "../scrollbar";

export function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const [dataService, setDataService] = useState([]);
  const [combo, setCombo] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedServiceCodes, setSelectedServiceCodes] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedComboId, setSelectedComboId] = useState(null);
  const [openQuantityNote, setOpenQuantityNote] = React.useState(false);
  const [openQuantityNoteService, setOpenQuantityNoteService] =
    React.useState(false);
  const [itemSelected, setItemSelected] = useState("");

  // Hàm get Service
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2003/api/home/service/getAll`
        ); // Thay đổi URL API của bạn tại đây
        console.log(response.data);
        setDataService(response.data);
      } catch (error) {
        if (error.response) {
          // Xử lý response lỗi
          if (error.response.status === 403) {
            alert("Bạn không có quyền truy cập vào trang này");
            window.location.href = "/auth/login"; // Thay đổi "/dang-nhap" bằng đường dẫn đến trang đăng nhập của bạn
          } else {
            alert("Có lỗi xảy ra trong quá trình gọi API");
          }
        } else {
          console.log("Không thể kết nối đến API");
        }
      }
    };
    fetchData();
  }, []);
  // Hàm get Combo
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2003/api/home/combo/getall`
        ); // Thay đổi URL API của bạn tại đây
        console.log("Combo", response.data);
        setCombo(response.data);
      } catch (error) {
        if (error.response) {
          // Xử lý response lỗi
          if (error.response.status === 403) {
            alert("Bạn không có quyền truy cập vào trang này");
            window.location.href = "/auth/login"; // Thay đổi "/dang-nhap" bằng đường dẫn đến trang đăng nhập của bạn
          } else {
            alert("Có lỗi xảy ra trong quá trình gọi API");
          }
        } else {
          console.log("Không thể kết nối đến API");
        }
      }
    };
    fetchData();
  }, []);

  const handleChange1 = (event) => {
    const { name, checked } = event.target;
    setCheckedItems((prevState) => ({ ...prevState, [name]: checked }));
    if (checked) {
      setSelectedServiceCodes((prevSelectedCodes) => [
        ...prevSelectedCodes,
        name,
      ]);
    } else {
      setSelectedServiceCodes((prevSelectedCodes) =>
        prevSelectedCodes.filter((code) => code !== name)
      );
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " VND";
  };
  const handleOpenQuantityNote = (serviceId) => {
    setItemSelected(serviceId);
    setSelectedServiceId(serviceId);
    setOpenQuantityNote(true);
  };
  const handleOpenQuantityNoteCombo = (comboId) => {
    setSelectedComboId(comboId);
    setOpenQuantityNote(true);
  };
  const handleSubmitQuantity = (item) => {
    setOpenQuantityNote(false);
    console.log(item);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Dịch vụ" {...a11yProps(0)} />
          <Tab label="Combo Dịch vụ" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <Dialog
        open={openQuantityNote}
        onClose={() => {}}
        fullWidth
        PaperProps={{
          style: {
            maxWidth: "30%",
            maxHeight: "90%",
          },
        }}
      >
        <DialogTitle>
          {selectedComboId !== null &&
            combo.find((combo) => combo.id === selectedComboId)?.comboName}
        </DialogTitle>
        <DialogContent>
          <TextField
            style={{ marginTop: 10 }}
            label="Số lượng"
            fullWidth
            variant="outlined"
          />
          <br />
          <br />
          <TextareaAutosize
            className="form-control"
            placeholder="Ghi chú"
            name="note"
            cols={100}
            style={{ height: 150 }}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-outline-warning"
            onClick={() => {
              setOpenQuantityNote(false);
            }}
          >
            HỦY
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={() => handleSubmitQuantity(itemSelected)}
          >
            XÁC NHẬN
          </button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openQuantityNoteService}
        onClose={() => {}}
        fullWidth
        PaperProps={{
          style: {
            maxWidth: "30%",
            maxHeight: "90%",
          },
        }}
      >
        <DialogTitle>
          {selectedServiceId !== null &&
            dataService.find((service) => service.id === selectedServiceId)
              ?.serviceName}
        </DialogTitle>
        <DialogContent>
          <TextField
            style={{ marginTop: 10 }}
            label="Số lượng"
            fullWidth
            variant="outlined"
          />
          <br />
          <br />
          <TextareaAutosize
            className="form-control"
            placeholder="Ghi chú"
            name="note"
            cols={100}
            style={{ height: 150 }}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-outline-warning"
            onClick={() => {
              setOpenQuantityNote(false);
            }}
          >
            HỦY
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={() => handleSubmitQuantity(dataService.id)}
          >
            XÁC NHẬN
          </button>
        </DialogActions>
      </Dialog>
      <CustomTabPanel value={value} index={0}>
        <div>
          <Scrollbar>
            <Box sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên dịch vụ</TableCell>
                    <TableCell>Loại dịch vụ</TableCell>
                    <TableCell>Đơn vị tính</TableCell>
                    <TableCell>Giá</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataService.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.serviceName}</TableCell>
                      <TableCell>
                        {service.serviceType.serviceTypeName}
                      </TableCell>
                      <TableCell>{service.unit.unitName}</TableCell>
                      <TableCell>{formatPrice(service.price)}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleOpenQuantityNote(service.id)}
                          className="btn btn-outline-primary"
                        >
                          Chọn
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Scrollbar>
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div>
          <Scrollbar>
            <Box sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên Combo</TableCell>
                    <TableCell>Dịch vụ</TableCell>
                    <TableCell>Đơn giá</TableCell>
                    <TableCell>Mô tả </TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {combo.map((combo) => (
                    <TableRow key={combo.id}>
                      <TableCell>{combo.comboName}</TableCell>
                      <TableCell>
                        {combo.comboServiceList.map((service) => (
                          <p key={service.service.id}>
                            {service.service.serviceName}
                          </p>
                        ))}
                      </TableCell>
                      <TableCell>{formatPrice(combo.price)}</TableCell>
                      <TableCell>{combo.note}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleOpenQuantityNoteCombo(combo.id)}
                          className="btn btn-outline-primary"
                        >
                          Chọn
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Scrollbar>
        </div>
      </CustomTabPanel>
    </Box>
  );
}
