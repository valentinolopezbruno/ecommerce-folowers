-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-07-2023 a las 06:38:59
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ecomerce-ivan`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `imagen` varchar(255) NOT NULL,
  `id_social` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `imagen`, `id_social`) VALUES
(1, 'Likes', 'instagram-aplicacion-tecnologia-lanzamiento-sociedad-historia.jpg', 1),
(53, 'Seguidores', 'minato-gif-16.gif.47', 2),
(54, 'Likes', 'tuiterr.png.41', 2),
(55, 'Juan', 'IMG_4435.png.49', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_cantidad`
--

CREATE TABLE `producto_cantidad` (
  `id` int(255) NOT NULL,
  `idProducto` int(255) NOT NULL,
  `cantidad` int(255) NOT NULL,
  `precio` int(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto_cantidad`
--

INSERT INTO `producto_cantidad` (`id`, `idProducto`, `cantidad`, `precio`) VALUES
(1, 1, 250, 1130),
(2, 1, 500, 1777),
(3, 1, 1000, 3223),
(4, 5, 100, 1000),
(5, 6, 100, 6000),
(6, 3, 100, 5),
(7, 19, 222, 22),
(8, 19, 22, 222),
(9, 20, 222, 22),
(10, 20, 22, 222),
(11, 21, 100, 1000),
(12, 22, 555, 555),
(13, 23, 555, 555),
(14, 24, 333, 3333),
(15, 25, 333, 3333),
(16, 26, 3333, 3333333),
(17, 27, 3333, 3333333),
(18, 28, 3333, 3333333),
(19, 29, 3333, 3333333),
(20, 30, 333, 3333),
(21, 31, 333, 3333),
(22, 32, 333, 3333),
(23, 33, 333, 333),
(24, 34, 333, 333),
(25, 35, 33, 333),
(26, 36, 3333, 333),
(27, 37, 333, 333),
(28, 38, 2222, 2222),
(29, 39, 333, 333),
(30, 40, 333, 3333),
(31, 41, 333, 333),
(32, 42, 333, 333),
(33, 43, 333, 333),
(34, 44, 6666, 6666),
(35, 45, 333, 333),
(36, 46, 333, 333),
(37, 47, 333, 333),
(38, 48, 333, 333),
(39, 49, 333, 333),
(40, 50, 333, 333),
(41, 51, 100, 2000),
(42, 52, 333, 333),
(43, 53, 333, 333),
(44, 54, 100, 1300),
(45, 54, 200, 200),
(46, 54, 500, 3000),
(47, 55, 300, 1111);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `social`
--

CREATE TABLE `social` (
  `id` int(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `imagen` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `social`
--

INSERT INTO `social` (`id`, `nombre`, `imagen`) VALUES
(1, 'Instagram', 'GIF-Instagram.webp'),
(2, 'Twitter', 'tuiterr.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `contra` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `contra`) VALUES
(1, 'ivan', 'manseri'),
(2, 'tino', 'manserino');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `producto_cantidad`
--
ALTER TABLE `producto_cantidad`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `social`
--
ALTER TABLE `social`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT de la tabla `producto_cantidad`
--
ALTER TABLE `producto_cantidad`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT de la tabla `social`
--
ALTER TABLE `social`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
