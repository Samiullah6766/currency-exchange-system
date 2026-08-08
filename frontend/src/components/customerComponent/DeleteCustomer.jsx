import React from "react";
import { deleteCustomer } from "../../services/CustomerService";
import { useNavigate, useParams } from "react-router-dom";

const DeleteCustomer = () => {
  const { id } = useParams();
  const navigator = useNavigate();

  const removeCustomer = async (id) => {
    try {
      await deleteCustomer(id);
      navigator("/customers-list");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-start vh-100 bg-light pt-5">
      <div className="card shadow p-4 text-center" style={{ width: "400px" }}>
        <h4 className="mb-3 text-danger">تأیید حذف</h4>

        <p>آیا مطمئن هستید که می‌خواهید این مشتری را حذف کنید؟</p>

        <div className="d-flex justify-content-center gap-2 mt-3">
          <button className="btn btn-danger" onClick={() => removeCustomer(id)}>
            بله، حذف شود
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigator("/customers-list")}
          >
            لغو
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCustomer;
