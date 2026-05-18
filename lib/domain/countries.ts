export const COUNTRIES = [
  { code: "CU", name: "Cuba",             flag: "🇨🇺" },
  { code: "ES", name: "España",           flag: "🇪🇸" },
  { code: "FR", name: "Francia",          flag: "🇫🇷" },
  { code: "IT", name: "Italia",           flag: "🇮🇹" },
  { code: "DE", name: "Alemania",         flag: "🇩🇪" },
  { code: "PT", name: "Portugal",         flag: "🇵🇹" },
  { code: "NL", name: "Países Bajos",     flag: "🇳🇱" },
  { code: "BE", name: "Bélgica",          flag: "🇧🇪" },
  { code: "GB", name: "Reino Unido",      flag: "🇬🇧" },
  { code: "US", name: "Estados Unidos",   flag: "🇺🇸" },
  { code: "MX", name: "México",           flag: "🇲🇽" },
  { code: "AR", name: "Argentina",        flag: "🇦🇷" },
  { code: "BR", name: "Brasil",           flag: "🇧🇷" },
  { code: "CL", name: "Chile",            flag: "🇨🇱" },
  { code: "CO", name: "Colombia",         flag: "🇨🇴" },
  { code: "DO", name: "Rep. Dominicana",  flag: "🇩🇴" },
  { code: "PE", name: "Perú",             flag: "🇵🇪" },
] as const;

export type CountryCode = (typeof COUNTRIES)[number]["code"];

export function findCountry(code: string) {
  return COUNTRIES.find((c) => c.code === code) ?? { code, name: code, flag: "🏳️" };
}
