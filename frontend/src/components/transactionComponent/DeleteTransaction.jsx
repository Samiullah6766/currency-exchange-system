import React from "react";
import { deleteTransaction } from "../../services/TransactionService";
import { useNavigate, useParams } from "react-router-dom";


const DeleteTransaction = () => {
    const navigator= useNavigate()
    const {id} = useParams()
    const removeTransaction = (id) => {
        deleteTransaction(id).then((response) => {
            console.log(response.data)
            navigator("/transactions-list")
        })
    }
  return (
    <div className="d-flex justify-content-center align-items-start vh-100 bg-light pt-5">
      <div className="card shadow p-4 text-center" style={{ width: "400px" }}>
        <h4 className="mb-3 text-danger">تائید کردن</h4>
        <p>مطمئن استی که معامله را حذف کنی؟</p>

        <div className="d-flex justify-content-center gap-2 mt-3">
          <button className="btn btn-danger" onClick={() => removeTransaction(id)}>
            بلی، حذف کنید
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigator("/transactions-list")}
          >
            لغو
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTransaction;
