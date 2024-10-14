"use client";
import Modal from "@/components/Modal";
import deviceServices from "@/services/deviceServices";
import { useState } from "react";
import Select from "react-select";
import { NumericFormat } from "react-number-format";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string;
  productLib: ProductLib;
};

type ProductLib = {
  category: {
    id: number;
    name: string;
  }[];
  deviceType: {
    id: number;
    name: string;
  }[];
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
  const { isOpen, onClose, accessToken, productLib } = props;

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
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [warranty, setWarranty] = useState(0);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // if (confirm("Add this data?")) {
    //   setIsLoading(true);
    //   try {
    //     const data = {
    //       name,
    //     };

    //     const result = await categoryServices.createCategory(accessToken, data);

    //     if (!result.status) {
    //       setAlert({
    //         status: true,
    //         color: "danger",
    //         message: result.message,
    //       });
    //       setIsLoading(false);
    //     } else {
    //       setAlert({
    //         status: true,
    //         color: "success",
    //         message: result.message,
    //       });
    //       setTimeout(() => {
    //         onClose();
    //       }, 1000);
    //     }
    //   } catch (error) {
    //     setAlert({
    //       status: true,
    //       color: "danger",
    //       message: "Something went wrong, please refresh and try again",
    //     });
    //     setIsLoading(false);
    //   }
    // }
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

  const optionsCategory = productLib.category?.map((e) => ({
    value: e.id,
    label: e.name?.toUpperCase(),
  }));

  const optionsDeviceType = productLib.deviceType?.map((e) => ({
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
          <input
            type="number"
            id="product_warranty"
            className="form-control"
            style={{ textTransform: "uppercase" }}
            required
            value={warranty}
            onChange={(e) => setWarranty(Number(e.target.value))}
          />
        </div>
      </Modal>
    )
  );
};

export default CreateProduct;
