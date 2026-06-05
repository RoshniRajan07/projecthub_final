package com.example.demo.config;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.
UsernamePasswordAuthenticationFilter;

import com.example.demo.security.JWTFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JWTFilter jwtFilter;

    @Bean
    public SecurityFilterChain
    securityFilterChain(

            HttpSecurity http)

            throws Exception {

        http

            // =====================================
            // BASIC SECURITY
            // =====================================

            .csrf(csrf -> csrf.disable())

            .cors(cors -> {})

            .formLogin(form -> form.disable())

            .httpBasic(basic -> basic.disable())

            .sessionManagement(session ->

                    session.sessionCreationPolicy(

                            SessionCreationPolicy.STATELESS))

            // =====================================
            // AUTHORIZATION
            // =====================================

            .authorizeHttpRequests(auth -> auth

                // ERROR + OPTIONS
                .requestMatchers("/error")
                .permitAll()

                .requestMatchers(
                        HttpMethod.OPTIONS,
                        "/**")
                .permitAll()

                .requestMatchers(
                        HttpMethod.GET,

                        "/projects/download/**")

                .permitAll()

                // =====================================
                // PUBLIC LOGIN / REGISTER
                // =====================================

                .requestMatchers(
                        HttpMethod.POST,

                        "/users/login",

                        "/auth/login",

                        "/auth/register",

                        "/users")

                .permitAll()

                // =====================================
                // SWAGGER
                // =====================================

                .requestMatchers(

                        "/swagger-ui/**",

                        "/swagger-ui.html",

                        "/v3/api-docs/**")

                .permitAll()

                // =====================================
                // ADMIN APIs
                // =====================================

                .requestMatchers("/admin/**")
                .hasRole("ADMIN")

                .requestMatchers(

                        "/users/settings/**",

                        "/users/admin/**",

                        "/users/audit-logs",

                        "/users/assign-faculty/**")

                .hasRole("ADMIN")

                .requestMatchers(
                        HttpMethod.GET,

                        "/users/filter/role")

                .hasAnyRole(
                        "STUDENT",
                        "FACULTY",
                        "ADMIN")

                .requestMatchers(
                        HttpMethod.GET,

                        "/users/{id}")

                .authenticated()

                .requestMatchers(
                        HttpMethod.GET,

                        "/users",

                        "/users/search")

                .hasRole("ADMIN")

                .requestMatchers(
                        HttpMethod.PUT,
                        "/users/*")

                .hasAnyRole(
                        "STUDENT",
                        "FACULTY",
                        "ADMIN")
                                .requestMatchers(
                        HttpMethod.DELETE,
                        "/users/notifications/**")

                .hasAnyRole(
                        "STUDENT",
                        "FACULTY",
                        "ADMIN")

                .requestMatchers(
                        HttpMethod.DELETE,
                        "/users/**")

                .hasRole("ADMIN")

                // =====================================
                // STUDENT PROFILE
                // =====================================

                .requestMatchers(
                        "/users/student/profile/**")

                .hasAnyRole(
                        "STUDENT",
                        "ADMIN")

                // =====================================
                // STUDENT PROJECT APIs
                // =====================================

                .requestMatchers(
                        HttpMethod.POST,

                        "/projects/mongo",

                        "/projects/mongo/certificates",

                        "/projects/*/upload",

                        "/certificates/*/upload")

                .hasAnyRole(
                        "STUDENT",
                        "ADMIN")

                .requestMatchers(
                        HttpMethod.DELETE,

                        "/projects/mongo/*")

                .hasAnyRole(
                        "STUDENT",
                        "ADMIN")

                .requestMatchers(
                        HttpMethod.PUT,

                        "/projects/mongo/update/**",

                        "/projects/mongo/resubmit/**",

                        "/projects/mongo/certificates/resubmit/**")

                .hasAnyRole(
                        "STUDENT",
                        "ADMIN")

                // =====================================
                // FACULTY REVIEW APIs
                // =====================================

                .requestMatchers(
                        HttpMethod.PUT,

                        "/projects/mongo/review/**",

                        "/projects/mongo/certificates/verify/**")

                .hasAnyRole(
                        "FACULTY",
                        "ADMIN")

                .requestMatchers(

                        "/projects/mongo/faculty/**",

                        "/projects/mongo/certificates/faculty/**")

                .hasAnyRole(
                        "FACULTY",
                        "ADMIN")

                // =====================================
                // AUTHENTICATED USERS
                // =====================================

                .requestMatchers(
                        "/projects/mongo/**")

                .authenticated()

                .requestMatchers(
                        "/projects/notifications/**")

                .authenticated()

                // =====================================
                // EVERYTHING ELSE
                // =====================================

                .anyRequest()
                .authenticated()
            );

        // =====================================
        // JWT FILTER
        // =====================================

        http.addFilterBefore(

                jwtFilter,

                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
