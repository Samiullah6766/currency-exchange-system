import React from "react";

const ViewRemittanceReceipt = () => {
    
  const totalAmount =
    Number(remittance.amount || 0) + Number(remittance.transferFee || 0);

  useEffect(() => {
    getRemittances().then((response) => {
      setRemittances(response.data);
    });
  }, []);

  return (
    <div
      className="min-vh-100 py-4"
      style={{
        background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
      }}
    >
      <div className="container">
        <div
          className="card border-0 shadow-lg mx-auto"
          style={{ maxWidth: "1100px" }}
        >
          {/* Receipt Header */}
          <div
            className="card-header text-white p-4"
            style={{
              background: "linear-gradient(90deg,#1e3c72,#2a5298)",
            }}
          >
            <div className="row align-items-center">
              <div className="col-md-8">
                <h2 className="fw-bold mb-1">AL-HABIB CURRENCY EXCHANGE</h2>

                <p className="mb-0">Remittance Transfer Receipt</p>
              </div>

              <div className="col-md-4 text-md-end">
                <span className="badge bg-success px-4 py-2 fs-6">
                  COMPLETED
                </span>
              </div>
            </div>
          </div>

          <div className="card-body p-4">
            {/* Receipt Information */}
            <div className="row mb-4">
              <div className="col-md-6">
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td className="fw-bold">Transaction Code:</td>
                      <td>{remittance.remittanceCode}</td>
                    </tr>

                    <tr>
                      <td className="fw-bold">Transfer Date:</td>
                      <td>{remittance.date}</td>
                    </tr>

                    <tr>
                      <td className="fw-bold">Currency:</td>
                      <td>{remittance.moneyType}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="col-md-6">
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td className="fw-bold">Branch:</td>
                      <td>Main Office</td>
                    </tr>

                    <tr>
                      <td className="fw-bold">Operator:</td>
                      <td>System User</td>
                    </tr>

                    <tr>
                      <td className="fw-bold">Status:</td>
                      <td>
                        <span className="badge bg-success">Completed</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sender & Receiver */}
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="card border-primary h-100">
                  <div className="card-header bg-primary text-white">
                    Sender Information
                  </div>

                  <div className="card-body">
                    <p>
                      <strong>Name:</strong> {remittance.sender}
                    </p>

                    <p>
                      <strong>Address:</strong> {remittance.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="card border-success h-100">
                  <div className="card-header bg-success text-white">
                    Receiver Information
                  </div>

                  <div className="card-body">
                    <p>
                      <strong>Name:</strong> {remittance.receiver}
                    </p>

                    <p>
                      <strong>Destination:</strong> {remittance.destination}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Section */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-dark text-white">
                Transfer Summary
              </div>

              <div className="card-body">
                <table className="table table-striped align-middle">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>Transfer Amount</td>
                      <td className="text-end fw-bold text-success">
                        {remittance.amount}
                      </td>
                    </tr>

                    <tr>
                      <td>Transfer Fee</td>
                      <td className="text-end fw-bold text-danger">
                        {remittance.transferFee}
                      </td>
                    </tr>

                    <tr className="table-primary">
                      <td className="fw-bold">Total Collected</td>

                      <td className="text-end fw-bold fs-5">{totalAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Description */}
            <div className="card border-0 bg-light mb-4">
              <div className="card-body">
                <h5 className="fw-bold">Transfer Description</h5>

                <p className="mb-0">
                  {remittance.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* Signature Area */}
            <div className="row mt-5">
              <div className="col-md-4 text-center">
                <hr />
                <p className="fw-bold">Sender Signature</p>
              </div>

              <div className="col-md-4 text-center">
                <hr />
                <p className="fw-bold">Authorized Officer</p>
              </div>

              <div className="col-md-4 text-center">
                <hr />
                <p className="fw-bold">Receiver Signature</p>
              </div>
            </div>

            {/* Footer */}
            <div className="alert alert-info mt-4">
              <strong>Important:</strong> Keep this receipt safely. It may be
              required for verification and future inquiries.
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button
                className="btn btn-success px-4"
                onClick={() => window.print()}
              >
                Print Receipt
              </button>

              <button className="btn btn-warning px-4">Edit</button>

              <button className="btn btn-secondary px-4">Back</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRemittanceReceipt;
