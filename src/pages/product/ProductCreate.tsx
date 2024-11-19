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

  const [formData, setFormData] = useState({
    name: "",
    sub_name: "",
    sell_price: 0,
    purchase_price: 0,
    warranty: 0,
    is_pos: "",
    is_invent: "",
    product_type: "",
    category: [],
    device: [],
    branch: branch,
    qty: 0,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirm("Add this data?")) {
      setIsLoading(true);
      try {
        const resultCreate = await productServices.createProduct(
          accessToken,
          JSON.stringify(formData)
        );

        if (!resultCreate.status) {
          setAlert({
            status: true,
            color: "danger",
            message: resultCreate.message,
          });
          setIsLoading(false);
        } else {
          setAlert({
            status: true,
            color: "success",
            message: resultCreate.message,
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
      const resultGetDevice = await deviceServices.getDeviceByType(
        accessToken!,
        Number(deviceType)
      );

      if (!resultGetDevice.status) {
        setAlert({
          status: true,
          color: "danger",
          message: resultGetDevice.message,
        });
      }

      setDataDevice(resultGetDevice.data);
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

  const handleCheckAllDevice = (isChecked: any) => {
    if (isChecked) {
      setFormData({
        ...formData,
        device: dataDevice?.map((e) => ({
          value: e.id,
          label: e.name?.toUpperCase(),
        })) as [],
      });
    } else {
      setFormData({
        ...formData,
        device: [],
      });
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

  if (!isOpen) return null;

  return (
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
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          value={formData.name}
        />
      </div>
      <div className="form-group">
        <label htmlFor="product_sub_name">Sub Nama Product</label>
        <input
          type="text"
          id="product_sub_name"
          className="form-control"
          style={{ textTransform: "uppercase" }}
          onChange={(e) =>
            setFormData({ ...formData, sub_name: e.target.value })
          }
          value={formData.sub_name}
        />
      </div>
      <div className="form-group">
        <label htmlFor="product_type">Tipe Produk</label>
        <Select
          instanceId={"product_type"}
          placeholder="Pilih Tipe Product"
          isClearable
          options={optionsProductType}
          required
          onChange={(e: any) =>
            setFormData({ ...formData, product_type: e ? e.value : "" })
          }
          value={
            formData.product_type
              ? optionsProductType.find(
                  (option: any) => option.value === formData.product_type
                )
              : null
          }
        />
      </div>
      <div className="form-group">
        <label htmlFor="product_category">Kategori</label>
        <Select
          instanceId={"product_category"}
          placeholder="Pilih Kategori"
          isClearable
          options={optionsCategory}
          required
          isMulti
          onChange={(e: any) => setFormData({ ...formData, category: e })}
          value={formData.category}
        />
      </div>

      <div className="form-group">
        <label htmlFor="product_device_type">Tipe Device</label>
        <Select
          instanceId={"product_device_type"}
          placeholder="Pilih Tipe Device"
          isClearable
          options={optionsDeviceType}
          required
          onChange={(e: any) => {
            setFormData({ ...formData, device: [] });
            setDataDevice([]);
            if (e) {
              handleGetDevice(e.value);
            }
          }}
        />
      </div>

      <div className="form-group">
        <label htmlFor="product_device">Device</label>
        <Select
          instanceId={"product_device"}
          placeholder="Pilih Device"
          isClearable
          options={optionsDevice}
          required
          isMulti
          onChange={(e: any) => setFormData({ ...formData, device: e })}
          value={formData.device}
          closeMenuOnSelect={false}
        />
        {dataDevice.length > 0 && (
          <div className="mt-2">
            <input
              type="checkbox"
              className="mr-1"
              onClick={(e: any) => handleCheckAllDevice(e.target.checked)}
            />
            Check All
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="product_purchase_price">Harga Beli</label>
        <NumericFormat
          id="product_purchase_price"
          className="form-control"
          defaultValue={
            formData.purchase_price === 0 ? "" : formData.purchase_price
          }
          thousandSeparator=","
          displayType="input"
          onValueChange={(values: any) => {
            setFormData({ ...formData, purchase_price: values.floatValue });
          }}
          allowLeadingZeros={false}
          allowNegative={false}
        />
      </div>

      <div className="form-group">
        <label htmlFor="product_sell_price">Harga Jual</label>
        <NumericFormat
          id="product_sell_price"
          className="form-control"
          defaultValue={formData.sell_price === 0 ? "" : formData.sell_price}
          thousandSeparator=","
          displayType="input"
          onValueChange={(values: any) => {
            setFormData({ ...formData, sell_price: values.floatValue });
          }}
          allowLeadingZeros={false}
          allowNegative={false}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="product_warranty">Garansi</label>
        <NumericFormat
          id="product_warranty"
          className="form-control"
          defaultValue={formData.warranty === 0 ? "" : formData.warranty}
          thousandSeparator=","
          displayType="input"
          onValueChange={(values: any) => {
            setFormData({ ...formData, warranty: values.floatValue });
          }}
          allowLeadingZeros={false}
          allowNegative={false}
          required
        />
      </div>
      <hr />

      <div className="form-group">
        <label htmlFor="product_is_pos">Tampilkan Di POS?</label>
        <select
          id="product_is_pos"
          className="custom-select"
          required
          value={formData.is_pos}
          onChange={(e) => setFormData({ ...formData, is_pos: e.target.value })}
        >
          <option value="">--PILIH--</option>
          <option value="1">YA</option>
          <option value="0">TIDAK</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="product_is_invent">Produk Inventaris?</label>
        <select
          id="product_is_invent"
          className="custom-select"
          required
          value={formData.is_invent}
          onChange={(e) =>
            setFormData({ ...formData, is_invent: e.target.value })
          }
        >
          <option value="">--PILIH--</option>
          <option value="1">YA</option>
          <option value="0">TIDAK</option>
        </select>
      </div>

      {formData.is_invent === "1" && (
        <div className="form-group">
          <label htmlFor="product_qty">QTY Awal Produk</label>
          <NumericFormat
            id="product_qty"
            className="form-control"
            defaultValue={formData.qty === 0 ? "" : formData.qty}
            thousandSeparator=","
            displayType="input"
            onValueChange={(values: any) => {
              setFormData({ ...formData, qty: values.floatValue });
            }}
            allowLeadingZeros={false}
            allowNegative={false}
            required={formData.is_invent === "1" ? true : false}
          />
        </div>
      )}
    </Modal>
  );
};

export default CreateProduct;
