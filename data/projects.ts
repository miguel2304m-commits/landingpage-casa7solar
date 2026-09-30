/**
 * Only add installations verified by Casa 7 Solar Energy.
 * Store approved photos under public/images/projects and preserve their source.
 * The images displayed in the conversation were not available as local files.
 */
export interface SolarProject {
  id: string;
  title: string;
  category: "Residencial" | "Empresarial" | "Rural";
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  sourceUrl: string;
  location?: string;
  powerKwp?: number;
  panelCount?: number;
  description?: string;
}

export const projects: SolarProject[] = [];

export const projectsSource = {
  label: "@casa7solarenergy",
  url: "https://www.instagram.com/casa7solarenergy/",
};

/** Populate only when the company supplies verifiable figures. */
export interface CompanyStatistics {
  completedProjects?: number;
  installedPowerKwp?: number;
  customersServed?: number;
}

export const companyStatistics: CompanyStatistics = {};
