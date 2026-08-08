import React from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { deleteWallet } from "../../services/WalletService";

const DeleteWallet = () => {

    const {id} = useParams()
    const navigator = useNavigate()

    function removeWallet(id){
        deleteWallet(id).then((response) => {
            navigator("/wallet")
        })
    }

  return (
    <div className="d-flex justify-content-center align-items-start vh-100 bg-light pt-5">
      <div className="card shadow p-4 text-center" style={{ width: "400px" }}>
        <h4 className="mb-3 text-danger">Confirm Delete</h4>
        <p>Are you sure you want to delete this Wallet?</p>

        <div className="d-flex justify-content-center gap-2 mt-3">
          <button
            className="btn btn-danger"
            onClick={() => removeWallet(id)}
          >
            Yes, Delete
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigator("/wallet")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteWallet;
