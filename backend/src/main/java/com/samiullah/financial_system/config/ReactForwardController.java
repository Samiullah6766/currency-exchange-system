package com.samiullah.financial_system.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ReactForwardController {

    @RequestMapping({
            "/customers-list",
            "/dashboard",
            "/add-customer",
            "/update-customer/**",
            "/create-transaction/**",
            "/transactions-list",
            "/create-exchangeTransaction",
            "/customer-transactions/**",
            "/delete-customer/**",
            "/delete-transaction/**",
            "/wallet",
            "/create-wallet",
            "/exchange-list",
            "/wallet-transactions",
            "/create-wallet-transaction",
            "/report",
            "/login",
            "/logout",
            "/sign-up",
            "/login-success",
            "/create-remittance",
            "/remittances",
            "/create-companyInfo",
            "/configurations",
            "/customerExchanges/**",
            "/owner-exchange",
            "/owner-exchange-transactions",
            "/update-companyInfo",
            "/update-remittance/**"
    })
    public String forward() {

        return "forward:/index.html";
    }
}