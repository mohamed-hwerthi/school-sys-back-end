import { Link, useParams } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import type { VitrineConfig, VitrinePage } from "@/types/vitrine";

interface Props {
  config: VitrineConfig;
  pages?: VitrinePage[];
}

export default function VitrineFooter({ config, pages = [] }: Props) {
  const { slug } = useParams<{ slug: string }>();

  const socialLinks = [
    {
      url: config.facebookUrl,
      icon: Facebook,
      label: "Facebook",
      color: "#1877F2",
    },
    {
      url: config.instagramUrl,
      icon: Instagram,
      label: "Instagram",
      color: "#E4405F",
    },
    {
      url: config.whatsappNumber
        ? `https://wa.me/${config.whatsappNumber.replace(/\D/g, "")}`
        : null,
      icon: MessageCircle,
      label: "WhatsApp",
      color: "#25D366",
    },
  ].filter((s) => s.url);

  return (
    <footer className="relative overflow-hidden">
      {/* Top wave separator */}
      <div className="relative w-full overflow-hidden leading-[0]">
        <svg
          className="relative block h-[50px] w-full sm:h-[70px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="fill-gray-900"
          />
        </svg>
      </div>

      {/* Footer content with dark gradient */}
      <div
        className="bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Column 1: School Info */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">
                {config.logoUrl && (
                  <img
                    src={config.logoUrl}
                    alt={config.schoolDisplayName}
                    className="h-12 w-12 rounded-full border-2 border-white/20 object-cover"
                  />
                )}
                <h3 className="text-xl font-bold text-white">
                  {config.schoolDisplayName}
                </h3>
              </div>
              {config.slogan && (
                <p className="mt-4 text-sm leading-relaxed text-gray-400">
                  {config.slogan}
                </p>
              )}
              {config.metaDescription && (
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  {config.metaDescription}
                </p>
              )}
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: config.accentColor }}
              >
                Liens rapides
              </h4>
              <ul className="mt-4 space-y-3">
                {pages
                  .filter((p) => p.visible)
                  .map((page) => (
                    <li key={page.id}>
                      <Link
                        to={`/vitrine/${slug}/${page.slug}`}
                        className="text-sm text-gray-400 transition-colors duration-200 hover:text-white"
                      >
                        {page.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div>
              <h4
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: config.accentColor }}
              >
                Contact
              </h4>
              <div className="mt-4 space-y-4">
                {config.contactPhone && (
                  <a
                    href={`tel:${config.contactPhone}`}
                    className="group flex items-start gap-3 text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors"
                      style={{ backgroundColor: config.primaryColor + "20" }}
                    >
                      <Phone
                        className="h-4 w-4"
                        style={{ color: config.primaryColor }}
                      />
                    </div>
                    <span className="pt-1.5">{config.contactPhone}</span>
                  </a>
                )}
                {config.contactEmail && (
                  <a
                    href={`mailto:${config.contactEmail}`}
                    className="group flex items-start gap-3 text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors"
                      style={{ backgroundColor: config.primaryColor + "20" }}
                    >
                      <Mail
                        className="h-4 w-4"
                        style={{ color: config.primaryColor }}
                      />
                    </div>
                    <span className="pt-1.5">{config.contactEmail}</span>
                  </a>
                )}
                {config.contactAddress && (
                  <div className="flex items-start gap-3 text-sm text-gray-400">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: config.primaryColor + "20" }}
                    >
                      <MapPin
                        className="h-4 w-4"
                        style={{ color: config.primaryColor }}
                      />
                    </div>
                    <span className="pt-1.5">{config.contactAddress}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Column 4: Social */}
            <div>
              <h4
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: config.accentColor }}
              >
                Suivez-nous
              </h4>
              <div className="mt-4 flex flex-wrap gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-all"
                      style={{ backgroundColor: social.color }}
                      whileHover={{ scale: 1.15, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.a>
                  );
                })}
              </div>
              {socialLinks.length === 0 && (
                <p className="mt-4 text-sm text-gray-500">
                  Bientot disponible
                </p>
              )}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 border-t border-gray-800 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} {config.schoolDisplayName}.
                Tous droits reserves.
              </p>
              <p className="text-xs text-gray-600">
                Fait avec{" "}
                <span className="text-red-500" aria-label="amour">
                  &#10084;
                </span>{" "}
                pour l'education
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
