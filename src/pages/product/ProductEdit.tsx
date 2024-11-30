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
  categoryData: Category[];
  deviceTypeData: DeviceType[];
  editData: Product;
};

type Product = {
  number: number;
  id: number;
  name: string;
  sub_name: string;
  sell_price: number;
  purchase_price: number;
  warranty: number;
  is_inventory: boolean;
  is_pos: boolean;
  product_type: string;
  created_at: Date;
  is_deleted: boolean;
  branch_id: number;
  product_category: {
    category: {
      id: number;
      name: string;
    };
  }[];
  product_device: {
    device: {
      id: number;
      name: string;
      device_type: {
        id: number;
        name: string;
      };
    };
  }[];
  branch: {
    id: number;
    name: string;
  };
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

const EditProduct = (props: Props) => {
  const {
    isOpen,
    onClose,
    accessToken,
    categoryData,
    deviceTypeData,
    editData,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHeader, setIsLoadingHeader] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [dataDevice, setDataDevice] = useState([] as Device[]);
  const [deviceType, setDeviceType] = useState(
    editData?.product_device[0].device.device_type.id || ""
  );

  const [formData, setFormData] = useState({
    name: editData?.name || "",
    sub_name: editData?.sub_name || "",
    sell_price: editData?.sell_price || 0,
    purchase_price: editData?.purchase_price || 0,
    warranty: editData?.warranty || 0,
    is_pos: editData?.is_pos ? "1" : "0",
    is_invent: editData?.is_inventory ? "1" : "0",
    product_type: editData?.product_type || "",
    category: editData?.product_category.map((e) => ({
      value: e.category.id,
      label: e.category.name?.toUpperCase(),
    })),
    device: editData?.product_device.map((e) => ({
      value: e.device.id,
      label: e.device.name?.toUpperCase(),
    })),
    branch: editData?.branch.id,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirm("Edit this data?")) {
      setIsLoading(true);
      try {
        const resultEdit = await productServices.editProduct(
          accessToken,
          editData.id,
          JSON.stringify(formData)
        );

        if (!resultEdit.status) {
          setAlert({
            status: true,
            color: "danger",
            message: resultEdit.message,
          });
          setIsLoading(false);
        } else {
          setAlert({
            status: true,
            color: "success",
            message: resultEdit.message,
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
      modalTitle="Edit Data"
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
          value={formData.sub_name}
          onChange={(e) =>
            setFormData({ ...formData, sub_name: e.target.value })
          }
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
          value={formData.category}
          onChange={(e: any) => setFormData({ ...formData, category: e })}
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
            setDeviceType(e.value);
            setFormData({ ...formData, device: [] });
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
          onChange={(e) => setFormData({ ...formData, is_pos: e.target.value })}
          value={formData.is_pos}
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
          onChange={(e) =>
            setFormData({ ...formData, is_invent: e.target.value })
          }
          value={formData.is_invent}
        >
          <option value="">--PILIH--</option>
          <option value="1">YA</option>
          <option value="0">TIDAK</option>
        </select>
      </div>
    </Modal>
  );
};

export default EditProduct;
