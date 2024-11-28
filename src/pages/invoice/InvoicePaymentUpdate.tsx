"use client";

import Modal from "@/components/Modal";
import invoiceService from "@/services/invoiceService";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import Select from "react-select";

type Props = {
  isOpen: boolean;
  onClose: (selectedProduct?: any) => void;
  accessToken: string;
  invoiceNumber: string;
  invoiceAmount: number;
  paymentMethodData: {
    id: number;
    name: string;
  }[];
  invoicePayment: number;
};

type Payment = {
  paymentId: string;
  nominal: number;
};

type AlertProps = {
  status: boolean;
  color: string;
  message: string;
};

const InvoicePaymentUpdate = (props: Props) => {
  const {
    isOpen,
    onClose,
    accessToken,
    invoiceNumber,
    invoiceAmount,
    paymentMethodData,
    invoicePayment,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [updatePayment, setUpdatePayment] = useState<Payment[]>([]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null); // Set alert back to null after 2 seconds
      }, 3000);

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [alert]);

  const handleAdditionalPayment = (
    index: number,
    paymentId: string,
    nominal: number
  ) => {
    setUpdatePayment((prev) => {
      const updated = [...prev];
      updated[index] = { paymentId, nominal };
      return updated;
    });
  };

  const handlePaymentMethodChange = (newMethod: string | null) => {
    setPaymentMethod(newMethod || "");
    if (newMethod === "1") {
      // Initialize two empty payment methods for method ID 1
      setUpdatePayment([
        { paymentId: "", nominal: 0 },
        { paymentId: "", nominal: 0 },
      ]);
    } else {
      // Reset to single payment method with nominal 0
      setUpdatePayment(newMethod ? [{ paymentId: newMethod, nominal: 0 }] : []);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirm("Submit this data?")) {
      setIsLoading(true);
      try {
        const resultCreate = await invoiceService.updatePayment(
          accessToken,
          invoiceNumber,
          JSON.stringify({
            payment_data: updatePayment,
          })
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

  if (!isOpen) return null;

  return (
    <Modal
      modalTitle={`Update Payment #${invoiceNumber}`}
      onClose={onClose}
      onSubmit={handleSubmit}
      alert={alert}
      isLoading={isLoading}
    >
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <span>
              <strong>Invoice Amount:</strong>
            </span>
            <span>Rp {invoiceAmount.toLocaleString()}</span>
          </div>
          <div className="d-flex justify-content-between mt-2">
            <span>
              <strong>Total Payment:</strong>
            </span>
            <span>Rp {invoicePayment.toLocaleString()}</span>
          </div>
          <div className="d-flex justify-content-between mt-2">
            <span>
              <strong>Payment Left:</strong>
            </span>
            <span>Rp {(invoiceAmount - invoicePayment).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="payment_method">Metode Pembayaran</label>
        <Select
          instanceId={"payment_method"}
          placeholder="Pilih Metode Pembayaran"
          isClearable
          options={paymentMethodData?.map((e) => ({
            value: e.id,
            label: e.name?.toUpperCase(),
          }))}
          required
          onChange={(e: any) =>
            handlePaymentMethodChange(e?.value?.toString() || null)
          }
        />
      </div>

      {paymentMethod === "1" &&
        updatePayment.map((payment, index) => (
          <div key={index}>
            <hr />
            <div className="form-group">
              <label htmlFor={`additional_payment_method_${index}`}>
                Metode Tambahan {index + 1}
              </label>
              <Select
                instanceId={`additional_payment_method_${index}`}
                placeholder={`Pilih Metode Pembayaran ${index + 1}`}
                isClearable
                options={paymentMethodData
                  ?.filter((e) => e.id !== 1)
                  .map((e) => ({
                    value: e.id,
                    label: e.name?.toUpperCase(),
                  }))}
                value={
                  payment.paymentId
                    ? {
                        value: payment.paymentId,
                        label: paymentMethodData
                          .find((p) => p.id.toString() === payment.paymentId)
                          ?.name?.toUpperCase(),
                      }
                    : null
                }
                onChange={(e: any) => {
                  handleAdditionalPayment(
                    index,
                    e ? e.value?.toString() : "",
                    payment.nominal
                  );
                }}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor={`additional_payment_nominal_${index}`}>
                Nominal {index + 1}
              </label>
              <NumericFormat
                id={`additional_payment_nominal_${index}`}
                className="form-control"
                value={payment.nominal}
                thousandSeparator=","
                displayType="input"
                onValueChange={(values: any) => {
                  handleAdditionalPayment(
                    index,
                    payment.paymentId,
                    values.floatValue || 0
                  );
                }}
                allowLeadingZeros={false}
                allowNegative={false}
                required
              />
            </div>
          </div>
        ))}

      {paymentMethod !== "1" &&
        paymentMethod !== "" &&
        paymentMethod !== null && (
          <div className="form-group">
            <label htmlFor="payment_nominal">Nominal Pembayaran</label>
            <NumericFormat
              id="payment_nominal"
              className="form-control"
              value={updatePayment[0]?.nominal || 0}
              thousandSeparator=","
              displayType="input"
              onValueChange={(values: any) => {
                handleAdditionalPayment(
                  0,
                  paymentMethod,
                  values.floatValue || 0
                );
              }}
              allowLeadingZeros={false}
              allowNegative={false}
              required
            />
          </div>
        )}
    </Modal>
  );
};

export default InvoicePaymentUpdate;
