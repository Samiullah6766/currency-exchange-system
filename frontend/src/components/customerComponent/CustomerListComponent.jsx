import React, { useEffect, useState } from "react";
import {
  CustomersList,
  getByCustomerName,
} from "../../services/CustomerService";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const CustomerListComponent = () => {
  const [customers, setCustomers] = useState([]);
  const [findingCustomerName, setFindingCustomerName] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const INITIAL_COUNT = 3; // or 11

  const navigator = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    searchCustomers();
  }, [findingCustomerName, customers]);

  const loadCustomers = () => {
    CustomersList()
      .then((response) => {
        const data = response.data.sort((a, b) => b.id - a.id);

        setCustomers(data);
        setFilteredCustomers(data);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          console.log("Error:", error);
        }
      });
  };
  const searchCustomers = () => {
    if (!findingCustomerName.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const keyword = findingCustomerName.toLowerCase();

    setFilteredCustomers(
      customers.filter((customer) =>
        `${customer.firstName} ${customer.lastName}`
          .toLowerCase()
          .includes(keyword),
      ),
    );
  };

  const updateCustomer = (id) => {
    navigator("/update-customer/" + id);
  };

  const addNewCustomer = () => {
    navigator("/add-customer");
  };

  const handleCustomerName = (e) => {
    e.preventDefault();
    searchCustomers();
  };
  const displayedCustomers = showAll
    ? filteredCustomers
    : filteredCustomers.slice(0, INITIAL_COUNT);

  return (
    <div className="container py-5">
      {/* Statistics */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Statistics */}
        <div className="card border-0 shadow-sm">
          <div className="card-body py-3 px-4">
            <h6 className="text-muted mb-2">تعداد مشتریان</h6>
            <h2 className="fw-bold text-primary mb-0">{customers.length}</h2>
          </div>
        </div>
        {/* Arrow */}
        <button
          className="btn btn-light border rounded-circle"
          onClick={() => navigator(-1)}
          title="بازگشت"
          style={{
            width: "42px",
            height: "42px",
          }}
        >
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>

      {/* Main Card */}
      <div className="card border-0 shadow-lg">
        <div className="card-body p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
            <div>
              <h2 className="fw-bold mb-1">مشتریان</h2>
            </div>

            <button className="btn btn-primary btn-lg" onClick={addNewCustomer}>
              <i className="bi bi-plus-circle me-2"></i>
              اضافه کردن
            </button>
          </div>

          {/* Search */}
          <form onSubmit={handleCustomerName} className="mb-4">
            <div className="input-group input-group-lg">
              <span className="input-group-text bg-white">
                <i className="bi bi-search"></i>
              </span>

              <input
                type="text"
                className="form-control"
                placeholder="جستجو مشتری"
                value={findingCustomerName}
                onChange={(e) => setFindingCustomerName(e.target.value)}
              />

              <button type="submit" className="btn btn-dark">
                جستجو
              </button>
            </div>
          </form>

          {/* Customer Table */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr
                  style={{
                    backgroundColor: "#edf4ff",
                    height: "70px",
                  }}
                >
                  <th
                    style={{
                      paddingTop: "20px",
                      paddingBottom: "20px",
                      color: "#495057",
                      fontWeight: "600",
                      borderBottom: "2px solid #dbe6f3",
                    }}
                  >
                    مشتری
                  </th>
                  <th
                    style={{
                      paddingTop: "20px",
                      paddingBottom: "20px",
                      color: "#495057",
                      fontWeight: "600",
                      borderBottom: "2px solid #dbe6f3",
                    }}
                  >
                    نام پدر
                  </th>

                  <th
                    style={{
                      paddingTop: "20px",
                      paddingBottom: "20px",
                      color: "#495057",
                      fontWeight: "600",
                      borderBottom: "2px solid #dbe6f3",
                    }}
                  >
                    ادرس
                  </th>

                  <th
                    style={{
                      paddingTop: "20px",
                      paddingBottom: "20px",
                      color: "#495057",
                      fontWeight: "600",
                      borderBottom: "2px solid #dbe6f3",
                    }}
                  >
                    ایمیل
                  </th>

                  <th
                    style={{
                      paddingTop: "20px",
                      paddingBottom: "20px",
                      color: "#495057",
                      fontWeight: "600",
                      borderBottom: "2px solid #dbe6f3",
                    }}
                  >
                    شماره تلیفون
                  </th>

                  <th
                    className="text-center"
                    style={{
                      paddingTop: "20px",
                      paddingBottom: "20px",
                      color: "#495057",
                      fontWeight: "600",
                      borderBottom: "2px solid #dbe6f3",
                    }}
                  >
                    ویرایش
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.length > 0 ? (
                  displayedCustomers.map((customer) => (
                    <tr key={customer.id}>
                      {/* Customer */}
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center fw-bold me-3"
                            style={{
                              width: "50px",
                              height: "50px",
                              minWidth: "50px",
                            }}
                          >
                            {customer.firstName?.charAt(0)}
                          </div>

                          <div>
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                              <a
                                href={`/customer-transactions/${customer.id}`}
                                className="text-decoration-none fw-semibold text-dark"
                                style={{ fontSize: "1rem" }}
                              >
                                {customer.firstName} {customer.lastName}
                              </a>

                              <span className="badge bg-light text-secondary border">
                                ID #{customer.id}
                              </span>
                            </div>

                            <div className="small text-muted">پروفایل</div>
                          </div>
                        </div>
                      </td>

                      {/* Father name */}
                      <td>
                        {customer.fatherName || (
                          <span className="text-muted">No father name</span>
                        )}
                      </td>

                      {/* Address */}
                      <td>
                        {customer.address || (
                          <span className="text-muted">No address</span>
                        )}
                      </td>

                      {/* Email */}
                      <td>{customer.email}</td>

                      {/* Phone */}
                      <td>{customer.number}</td>

                      {/* Actions */}
                      <td className="text-center">
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => updateCustomer(customer.id)}
                          title="Update"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <i className="bi bi-people fs-1 text-muted"></i>

                      <div className="mt-3 text-muted">No customers found</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {filteredCustomers.length > INITIAL_COUNT && (
            <div className="text-center py-3">
              <button
                className="btn btn-outline-primary"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? (
                  <>
                    <i className="bi bi-chevron-up me-2"></i>
                    نمایش کمتر
                  </>
                ) : (
                  <>
                    <i className="bi bi-chevron-down me-2"></i>
                    نمایش بیشتر ({filteredCustomers.length - INITIAL_COUNT}{" "}
                    بیشتر)
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerListComponent;
