# REST API dengan Authentication, JWT, dan Role-Based Authorization

## Overview

Project ini merupakan REST API menggunakan Express.js yang mengimplementasikan:

* Authentication menggunakan JWT (JSON Web Token)
* Authorization menggunakan Role-Based Access Control (RBAC)
* Hashing password dengan bcrypt
* Database menggunakan Prisma ORM dan PostgreSQL
* Soft Delete pada resource Product

Resource utama:

* User
* Product
* Gudang

---

## Tech Stack

* Node.js (Express.js)
* PostgreSQL
* Prisma ORM
* JSON Web Token (JWT)
* bcrypt
* cookie-parser

---

## Desain Database

### User

* id (Primary Key)
* email (Unique)
* password (Hashed)
* role (admin / user)
* createdAt

### Product

* id (Primary Key)
* name
* price
* createdAt
* deletedAt (nullable, digunakan untuk soft delete)

### Gudang

* id (Primary Key)
* name
* location
* createdAt

### Relasi

Tidak ada relasi antar tabel.  
Fokus project ini adalah pada authentication dan authorization, bukan kompleksitas relasi database.

---

## Arsitektur

Menggunakan layered architecture:

* Routes → endpoint
* Controller → handle request & response
* Service → logic + akses database
* Middleware → auth & role check
* Error Middleware → centralized error handling

### Flow Request

Request → Route → Middleware → Controller → Service → Database → Response

---

## Authentication Flow

### Register

* User kirim email dan password
* Password di-hash dengan bcrypt
* Disimpan ke database

### Login

* Validasi email
* Compare password (bcrypt)
* Generate JWT berisi:

  * id
  * role
* Token disimpan di HttpOnly Cookie

### Logout

* Cookie dihapus
* Tidak menggunakan session di server

---

## Analogi JWT

JWT seperti tiket masuk:

* Saat login, user mendapatkan token (tiket)
* Saat akses endpoint, server hanya memverifikasi token
* Tidak perlu cek database setiap request

---

## Authorization (RBAC)

### Role

* user
* admin

### Aturan Akses

#### Product

* GET /api/products → semua user login
* POST /api/products → admin
* PUT /api/products/:id → admin
* DELETE /api/products/:id → admin (soft delete)
* PATCH /api/products/:id/restore → admin (restore data)

#### Gudang

* GET /api/gudang → semua user login
* POST /api/gudang → admin

---

## Middleware

### verifyToken

* Ambil token dari cookie atau header (Bearer Token)
* Validasi JWT
* Simpan data user ke req.user

### requireAdmin

* Cek role user
* Hanya admin yang boleh lanjut

---

## Soft Delete Mechanism

Pada resource Product, sistem menggunakan soft delete.

Soft delete dilakukan dengan menambahkan field `deletedAt` pada tabel Product.

### Behavior:

* DELETE /api/products/:id  
  → tidak menghapus data, tetapi mengisi field `deletedAt`

* GET /api/products  
  → hanya menampilkan data dengan `deletedAt = null`

* PATCH /api/products/:id/restore  
  → mengembalikan data dengan mengosongkan `deletedAt`

### Keuntungan:

* Data tidak hilang secara permanen
* Dapat dilakukan restore jika diperlukan
* Menjaga histori data

---

## Error Handling

Menggunakan centralized error handling middleware.

Semua response error dalam bentuk JSON:

* 400 → Bad Request (validasi gagal)
* 401 → Unauthorized (belum login / token invalid)
* 403 → Forbidden (role tidak sesuai)
* 404 → Data tidak ditemukan
* 500 → Internal Server Error

Tidak ada response HTML error.

---

## Analisis JWT

### Kelebihan

* Stateless (tidak menyimpan session di server)
* Mudah di-scale (cocok untuk microservices)
* Tidak perlu query database setiap request

### Kekurangan

* Tidak bisa revoke token secara langsung
* Jika token bocor, tetap valid sampai expire
* Perlu strategi tambahan (blacklist / expiry pendek)

---

## Endpoint API

### Auth

* POST /api/register
* POST /api/login
* POST /api/logout

### Products

* GET /api/products
* POST /api/products
* PUT /api/products/:id
* DELETE /api/products/:id (soft delete)
* PATCH /api/products/:id/restore

### Gudang

* GET /api/gudang
* POST /api/gudang

---

## Flow Demo

1. Register user
2. Login user
3. Akses products (GET) → berhasil
4. Coba create product → gagal (403)
5. Login sebagai admin
6. Create product → berhasil
7. Update product → berhasil
8. Delete product → soft delete (data tidak hilang)
9. Restore product → data muncul kembali
10. Gudang:

   * user → hanya GET
   * admin → bisa POST
11. Logout → akses ditolak (401)

---

## Kesimpulan

Project ini berhasil mengimplementasikan:

* Authentication dengan JWT
* Authorization berbasis role (RBAC)
* Soft delete untuk menjaga integritas data
* Centralized error handling
* Struktur code yang modular dan terpisah

Sistem ini scalable, aman, dan mengikuti best practice backend.