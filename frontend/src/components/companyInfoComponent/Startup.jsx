import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isInitialized } from "../../services/CompanyInfoService";

const Startup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    isInitialized()
      .then((res) => {
        if (res.data) {
          // Company already exists
          navigate("/dashboard", { replace: true });
        } else {
          // First time installation
          navigate("/create-companyInfo", { replace: true });
        }
      })
      .catch(() => {
        navigate("/create-companyInfo", { replace: true });
      });
  }, []);

  return (
    <div className="text-center mt-5">
      Loading...
    </div>
  );
};

export default Startup;