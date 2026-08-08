package com.samiullah.financial_system.controllers.userFiles;

import com.samiullah.financial_system.JWT.Util.JwtService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthFilter(JwtService jwtService, CustomUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("METHOD = " + request.getMethod());
        System.out.println("PATH = " + request.getServletPath());

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }
        if (request.getServletPath().startsWith("/auth")
                || request.getServletPath().startsWith("/uploads")) {

            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        System.out.println("🔐 JWT FILTER HIT");
        System.out.println("AUTH HEADER: " + authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        if (token == null || token.equals("null") || token.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        token = authHeader.substring(7);

        String username;

        try {
            username = jwtService.extractUsername(token);

        } catch (ExpiredJwtException e) {

            System.out.println("❌ JWT expired: " + e.getMessage());

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("JWT expired");
            return;

        } catch (Exception e) {

            System.out.println("❌ Invalid JWT: " + e.getMessage());

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid JWT");
            return;
        }

        System.out.println("EXTRACTED USER: " + username);

        if (username != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
        filterChain.doFilter(request, response);
    }


}
