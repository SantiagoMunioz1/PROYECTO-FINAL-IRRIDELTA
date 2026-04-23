import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Facebook,
  Handshake,
  Instagram,
  Lightbulb,
  TrendingUp,
  X,
} from "lucide-react";

const highlights = [
  { number: "30+", text: "Anos de experiencia" },
  { number: "2012", text: "Nuestro inicio" },
  { number: "100+", text: "Instaladores capacitados" },
  { number: "20+", text: "Marcas lideres" },
];

const socialLinks = [
  {
    icon: Instagram,
    href: "https://instagram.com/irridelta",
    label: "Instagram",
    color: "text-pink-600",
    hover: "hover:bg-pink-600",
  },
  {
    icon: Facebook,
    href: "https://www.facebook.com/p/Irridelta-100064054083065/?locale=es_LA",
    label: "Facebook",
    color: "text-blue-600",
    hover: "hover:bg-blue-600",
  },
];

const values = [
  {
    icon: Lightbulb,
    title: "Nuestra Mision",
    description:
      "Ser el socio estrategico que provee productos de primer nivel y la capacitacion necesaria para el exito de tus proyectos.",
  },
  {
    icon: TrendingUp,
    title: "Nuestra Vision",
    description:
      "Consolidarnos como el distribuidor lider en insumos de la region, reconocido por la calidad, la innovacion y el soporte tecnico.",
  },
  {
    icon: Handshake,
    title: "Nuestros Valores",
    description:
      "Compromiso con el cliente, experiencia profunda en el sector y una busqueda constante de crecimiento y excelencia.",
  },
];

function ValueCard({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center rounded-xl border-t-4 border-yellow-500 bg-white p-6 text-center shadow-lg">
      <Icon className="mb-4 h-10 w-10 text-yellow-500" />
      <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function About() {
  const location = useLocation();
  const navigate = useNavigate();
  const [welcomeModal, setWelcomeModal] = useState(null);

  useEffect(() => {
    if (!location.state?.welcomeModal) {
      return;
    }

    setWelcomeModal(location.state.welcomeModal);
    navigate(location.pathname, { replace: true });
  }, [location.pathname, location.state, navigate]);

  const closeWelcomeModal = () => {
    setWelcomeModal(null);
  };

  return (
    <>
      <div className="w-full bg-white">
        <header
          className="relative bg-gradient-to-br from-green-700 to-yellow-500 pb-28 pt-20 text-white md:pb-40"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)" }}
        >
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="mb-3 text-3xl font-extrabold md:text-5xl">
              Nuestra Historia, Nuestro Compromiso
            </h1>
            <p className="text-lg font-light md:text-xl">
              Desde 1990, generando experiencia y conocimiento para tu proyecto.
            </p>
          </div>
        </header>

        <section className="relative z-10 -mt-16 py-16 md:-mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-xl bg-white p-4 shadow-2xl sm:p-8">
              <h2 className="mb-4 text-2xl font-bold uppercase tracking-wider text-green-700">
                Nosotros...
              </h2>

              <p className="mt-4 text-justify text-base leading-relaxed text-gray-700 md:text-lg">
                Desde fines de los 90 trabajamos en el sector del riego generando{" "}
                <strong>experiencia y conocimientos</strong>. Iniciamos nuestro
                recorrido como instaladores de sistemas residenciales, deportivos
                y agricolas. En 2012 abrimos nuestro local en Benavidez que
                llamamos <strong>IRRIDELTA</strong>, enfocandonos en la{" "}
                <strong>venta de insumos</strong>, <strong>capacitacion</strong> y{" "}
                <strong>formacion</strong> de instaladores independientes. Desde
                entonces somos distribuidores de las principales marcas en el
                rubro del riego.
              </p>

              <p className="mt-4 text-justify text-base leading-relaxed text-gray-700 md:text-lg">
                Comenzamos con la comercializacion de productos de riego y de a
                poco incorporamos otras lineas afines como piscinas, tratamientos
                de agua con ablandadores, bombas centrifugas, sumergibles,
                perifericas, multietapas, desagote, herramientas de jardineria y
                maquinas de explosion, para acompanar los requerimientos del
                publico.
              </p>

              <p className="mt-4 text-justify text-base leading-relaxed text-gray-700 md:text-lg">
                En octubre de 2024 abrimos una <strong>nueva sucursal</strong> en
                Escobar para atender mejor la demanda creciente de la zona.
              </p>

              <p className="mt-4 text-justify text-base leading-relaxed text-gray-700 md:text-lg">
                <strong>Nuestro objetivo</strong> es contar con una importante
                variedad de <strong>productos de primer nivel</strong> que permitan
                a nuestros clientes encontrar la mejor opcion para sus proyectos
                en cada situacion particular. Para eso sumamos una creciente
                variedad de marcas de primera linea internacional.
              </p>

              <p className="mt-4 text-justify text-base leading-relaxed text-gray-700 md:text-lg">
                <strong>Involucrarnos</strong> en los desafios que nos plantean
                nuestros clientes y sus distintos proyectos es parte de nuestra
                esencia para acompanarlos en el crecimiento.
              </p>

              <p className="mt-4 text-justify text-base leading-relaxed text-gray-700 md:text-lg">
                <strong>Capacitamos</strong> permanentemente a nuestro personal
                para ser los primeros en implementar las nuevas tecnologias que
                llegan al pais.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              {highlights.map((item) => (
                <div key={item.text} className="p-4">
                  <p className="text-5xl font-extrabold text-green-700">
                    {item.number}
                  </p>
                  <p className="mt-2 text-lg text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl font-extrabold text-gray-900">
              Nuestro Proposito
            </h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {values.map((value) => (
                <ValueCard
                  key={value.title}
                  icon={value.icon}
                  title={value.title}
                  description={value.description}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mb-16 bg-gray-300 py-12">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">
              Seguinos en nuestras redes
            </h2>

            <div className="flex justify-center space-x-6">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-full bg-gray-100 p-4 shadow-md transition duration-300 hover:scale-110 hover:text-white ${link.color} ${link.hover}`}
                  aria-label={`Visita nuestro perfil de ${link.label}`}
                >
                  <link.icon className="h-8 w-8" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-blue-600 py-16 text-center text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-4 text-3xl font-extrabold">
              Conoce al equipo que lo hace posible
            </h2>
            <p className="mb-8 text-xl">
              Te invitamos a pasar por nuestros locales de Benavidez y Escobar o
              contactarnos.
            </p>
            <Link
              to="/contacto"
              className="rounded-lg bg-white px-8 py-3 font-bold text-blue-600 shadow-xl transition duration-300 hover:bg-gray-100"
            >
              Contactanos
            </Link>
          </div>
        </section>
      </div>

      {welcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <button
            type="button"
            aria-label="Cerrar modal de bienvenida"
            onClick={closeWelcomeModal}
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
          />

          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <div className="relative bg-gradient-to-r from-green-700 via-green-600 to-yellow-500 px-8 pb-16 pt-8 text-white">
              <button
                type="button"
                onClick={closeWelcomeModal}
                className="absolute right-5 top-5 rounded-full bg-white/15 p-2 transition hover:bg-white/25"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="inline-flex rounded-full bg-white/15 p-4">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.35em] text-green-100">
                Bienvenido a Irridelta
              </p>
              <h3 className="mt-3 text-3xl font-extrabold leading-tight">
                {welcomeModal.title}
              </h3>
            </div>

            <div className="px-8 pb-8 pt-6">
              <p className="text-base leading-7 text-slate-600">
                {welcomeModal.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={closeWelcomeModal}
                  className="rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-green-700"
                >
                  Empezar recorrido
                </button>
                <Link
                  to="/productos"
                  className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                >
                  Ver productos
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default About;
