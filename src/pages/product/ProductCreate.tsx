"use client";
import Modal from "@/components/Modal";
import deviceServices from "@/services/deviceServices";
import { useState } from "react";
import Select from "react-select";
import { NumericFormat } from "react-number-format";
import productServices from "@/services/productServices";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string;
  branch: number;
  categoryData: Category[];
  deviceTypeData: DeviceType[];
};

type Category = {
  id: number;
  name: string;
};
type DeviceType = {
  id: number;
  name: string;
};

type Device = {
  id: number;
  name: string;
};

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

const CreateProduct = (props: Props) => {
  const { isOpen, onClose, accessToken, branch, categoryData, deviceTypeData } =
    props;

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHeader, setIsLoadingHeader] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [dataDevice, setDataDevice] = useState([] as Device[]);

  const [productName, setProductName] = useState("");
  const [subProductName, setSubProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [category, setCategory] = useState([]);
  const [deviceType, setDeviceType] = useState("");
  const [device, setDevice] = useState([]);
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [warranty, setWarranty] = useState("");
  const [isPos, setIsPos] = useState("");
  const [isInvent, setIsInvent] = useState("");
  const [qty, setQty] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirm("Add this data?")) {
      setIsLoading(true);
      try {
        const data = {
          name: productName,
          sub_name: subProductName,
          sell_price: Number(sellPrice),
          purchase_price: Number(purchasePrice),
          warranty: Number(warranty),
          is_pos: isPos,
          is_invent: isInvent,
          product_type: productType,
          category: category,
          device: device,
          branch: Number(branch),
          qty: qty === "" ? 0 : Number(qty),
        };

        const result = await productServices.createProduct(accessToken, data);

        if (!result.status) {
          setAlert({
            status: true,
            color: "danger",
            message: result.message,
          });
          setIsLoading(false);
        } else {
          setAlert({
            status: true,
            color: "success",
            message: result.message,
          });
          setTimeout(() => {
            onClose();
          }, 1000);
        }
      } catch (error) {
        setAlert({
          status: true,
          color: "danger",
          message: "Something went wrong, please refresh and try again",
        });
        setIsLoading(false);
      }
    }
  };

  const handleGetDevice = async (deviceType: string) => {
    setIsLoadingHeader(true);
    try {
      const result = await deviceServices.getDeviceByType(
        accessToken!,
        Number(deviceType)
      );

      if (!result.status) {
        setAlert({
          status: true,
          color: "danger",
          message: result.message,
        });
      }

      setDataDevice(result.data);
    } catch (error) {
      setAlert({
        status: true,
        color: "danger",
        message: "Something went wrong, please refresh and try again",
      });
    } finally {
      setIsLoadingHeader(false);
    }
  };

  const optionsProductType = [
    { value: "INTERFACE", label: "INTERFACE" },
    { value: "MACHINE", label: "MACHINE" },
    { value: "ACCESSORY", label: "ACCESSORY" },
    { value: "OTHER", label: "DLL" },
  ];

  const optionsCategory = categoryData?.map((e) => ({
    value: e.id,
    label: e.name?.toUpperCase(),
  }));

  const optionsDeviceType = deviceTypeData?.map((e) => ({
    value: e.id,
    label: e.name?.toUpperCase(),
  }));

  const optionsDevice = dataDevice?.map((e) => ({
    value: e.id,
    label: e.name?.toUpperCase(),
  }));

  return (
    isOpen && (
      <Modal
        modalTitle="Tambah Data"
        onClose={onClose}
        onSubmit={handleSubmit}
        alert={alert}
        isLoading={isLoading}
        isLoadingHeader={isLoadingHeader}
      >
        <div className="form-group">
          <label htmlFor="product_name">Nama Product</label>
          <input
            type="text"
            id="product_name"
            className="form-control"
            style={{ textTransform: "uppercase" }}
            required
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="product_sub_name">Sub Nama Product</label>
          <input
            type="text"
            id="product_sub_name"
            className="form-control"
            style={{ textTransform: "uppercase" }}
            value={subProductName}
            onChange={(e) => setSubProductName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="product_type">Tipe Produk</label>
          <Select
            placeholder="Pilih Tipe Product"
            isClearable
            options={optionsProductType}
            required
            onChange={(e: any) => setProductType(e ? e.value : "")}
            value={
              productType
                ? optionsProductType.find(
                    (option: any) => option.value === productType
                  )
                : null
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="product_type">Kategori</label>
          <Select
            placeholder="Pilih Kategori"
            isClearable
            options={optionsCategory}
            required
            isMulti
            onChange={(e: any) => setCategory(e)}
            value={category}
          />
        </div>

        <div className="form-group">
          <label htmlFor="product_device_type">Tipe Device</label>
          <Select
            placeholder="Pilih Tipe Device"
            isClearable
            options={optionsDeviceType}
            required
            onChange={(e: any) => {
              setDeviceType(e ? e.value : "");
              setDevice([]);
              if (e) {
                handleGetDevice(e.value);
              }
            }}
            value={
              deviceType
                ? optionsDeviceType.find(
                    (option: any) => option.value === deviceType
                  )
                : null
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="product_device_type">Device</label>
          <Select
            placeholder="Pilih Device"
            isClearable
            options={optionsDevice}
            required
            isMulti
            onChange={(e: any) => setDevice(e)}
            value={device}
            closeMenuOnSelect={false}
          />
        </div>

        <div className="form-group">
          <label htmlFor="purchase_price">Harga Beli</label>
          <NumericFormat
            className="form-control"
            defaultValue={purchasePrice}
            thousandSeparator=","
            displayType="input"
            onValueChange={(values: any) => {
              setPurchasePrice(values.floatValue);
            }}
            allowLeadingZeros={false}
            allowNegative={false}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="sell_price">Harga Jual</label>
          <NumericFormat
            className="form-control"
            defaultValue={sellPrice}
            thousandSeparator=","
            displayType="input"
            onValueChange={(values: any) => {
              setSellPrice(values.floatValue);
            }}
            allowLeadingZeros={false}
            allowNegative={false}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="product_warranty">Garansi</label>
          <NumericFormat
            className="form-control"
            defaultValue={warranty}
            thousandSeparator=","
            displayType="input"
            onValueChange={(values: any) => {
              setWarranty(values.floatValue);
            }}
            allowLeadingZeros={false}
            allowNegative={false}
            required
          />
        </div>
        <hr />

        <div className="form-group">
          <label htmlFor="isPos">Tampilkan Di POS?</label>
          <select
            className="custom-select"
            id="isPos"
            required
            value={isPos}
            onChange={(e) => setIsPos(e.target.value)}
          >
            <option value="">--PILIH--</option>
            <option value="1">YA</option>
            <option value="0">TIDAK</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="isInvent">Produk Inventaris?</label>
          <select
            className="custom-select"
            id="isInvent"
            required
            value={isInvent}
            onChange={(e) => setIsInvent(e.target.value)}
          >
            <option value="">--PILIH--</option>
            <option value="1">YA</option>
            <option value="0">TIDAK</option>
          </select>
        </div>

        {isInvent === "1" && (
          <div className="form-group">
            <label htmlFor="qty">QTY Awal Produk</label>
            <NumericFormat
              className="form-control"
              defaultValue={qty}
              thousandSeparator=","
              displayType="input"
              onValueChange={(values: any) => {
                setQty(values.floatValue);
              }}
              allowLeadingZeros={false}
              allowNegative={false}
              required={isInvent === "1" ? true : false}
            />
          </div>
        )}
      </Modal>
    )
  );
};

export default CreateProduct;
