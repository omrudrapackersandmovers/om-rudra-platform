# 1st Om Packers and Movers Pvt. Ltd.

Official enterprise web platform for **1st Om Packers and Movers**, offering reliable household relocation, commercial office shifting, vehicle transport, and warehousing across Bihar, Jharkhand, Uttar Pradesh, Delhi NCR, West Bengal, and nationwide corridors.

---

## 📊 Complete Website Architecture & Page Count

The platform features **168 total pages**, driven by a unified static data layer designed for high local SEO authority, fast mobile loading, and zero duplicate-content penalties.

### 1. Places & Location-Driven Pages (151 Pages Total)

* **Where We Serve Hub (`/where-we-serve`)**: **1 Page**  
  Interactive state-by-state relocation directory with search, hub highlights, and network stats.

* **City & District Landing Pages (`/packers-movers-:slug`)**: **114 Pages**
  * **Bihar (36 pages)**:
    * *Primary Hubs (4)*: Patna (Headquarters), Gaya, Muzaffarpur, Bhagalpur
    * *Districts (32)*: Nalanda, Arrah (Bhojpur), Chapra (Saran), Darbhanga, Purnia, Samastipur, Begusarai, Sitamarhi, Madhubani, Supaul, Kishanganj, Araria, Katihar, Munger, Lakhisarai, Sheikhpura, Nawada, Aurangabad, Rohtas (Sasaram), Kaimur (Bhabua), Buxar, Siwan, Gopalganj, East Champaran (Motihari), West Champaran (Bettiah), Sheohar, Vaishali (Hajipur), Jehanabad, Arwal, Banka, Jamui, Khagaria.
  * **Jharkhand (23 pages)**:
    * *Regional Hubs (3)*: Ranchi, Jamshedpur, Dhanbad
    * *Districts (20)*: Bokaro, Hazaribagh, Deoghar, Giridih, Dumka, Palamu, Chaibasa, Chakulia, Simdega, Lohardaga, Gumla, Khunti, Chatra, Koderma, Jamtara, Pakur, Godda, Sahibganj, Ramgarh, Seraikela-Kharsawan.
  * **Uttar Pradesh (23 pages)**:
    * *Regional Hubs (4)*: Varanasi, Lucknow, Prayagraj (Allahabad), Gorakhpur
    * *Cities & Districts (19)*: Agra, Kanpur, Meerut, Bareilly, Aligarh, Moradabad, Saharanpur, Ghaziabad, Jhansi, Mathura, Firozabad, Deoria, Kushinagar, Basti, Ballia, Azamgarh, Ghazipur, Mirzapur, Sonbhadra.
  * **Delhi NCR (6 pages)**:
    * *Hub (1)*: Delhi
    * *NCR Cities (5)*: Noida, Greater Noida, Gurgaon (Gurugram), Faridabad, Ghaziabad (NCR).
  * **West Bengal (14 pages)**:
    * *Regional Hubs (3)*: Kolkata, Siliguri, Asansol
    * *Cities & Districts (11)*: Durgapur, Howrah, Kharagpur, Burdwan, Malda, Murshidabad, Nadia, North 24 Parganas, South 24 Parganas, Cooch Behar, Jalpaiguri.
  * **Other Major Relocation Metros (12 pages)**:
    * Mumbai, Pune, Bengaluru, Hyderabad, Chennai, Ahmedabad, Surat, Jaipur, Indore, Bhopal, Nagpur, Chandigarh.

* **High-Intent Interstate Corridors (`/route/:slug`)**: **36 Pages**
  * *From Patna (20 routes)*: Delhi NCR, Kolkata, Ranchi, Mumbai, Bengaluru, Hyderabad, Lucknow, Varanasi, Jamshedpur, Dhanbad, Siliguri, Pune, Chennai, Jaipur, Ahmedabad, Bhopal, Indore, Chandigarh, Gurgaon, Noida.
  * *From Ranchi (6 routes)*: Delhi NCR, Kolkata, Mumbai, Patna, Bengaluru, Hyderabad.
  * *From Gaya (2 routes)*: Delhi NCR, Kolkata.
  * *From Muzaffarpur (2 routes)*: Delhi NCR, Kolkata.
  * *From Bhagalpur (2 routes)*: Delhi NCR, Kolkata.
  * *From Jamshedpur (4 routes)*: Delhi NCR, Kolkata, Mumbai, Bengaluru.

---

### 2. Core, Service, Legal & Utility Pages (17 Pages Total)

* **Core & Lead Capture Pages (7 pages)**:
  * `/` (Homepage)
  * `/about` (Company story, values, operational footprint)
  * `/pricing` (Comprehensive pricing guide, moving cost estimator)
  * `/contact` (Branch directory, phone numbers, map coordinates)
  * `/get-quote` (Online move survey & lead capture)
  * `/privacy` (Privacy Policy)
  * `/terms` (Terms of Service)

* **Service Pages (9 pages)**:
  * `/services` (Services index & overview)
  * `/services/home-shifting` (Household goods relocation)
  * `/services/office-commercial-shifting` (Office & corporate IT relocation)
  * `/services/car-transportation` (Enclosed vehicle car carriers)
  * `/services/bike-transportation` (Crated two-wheeler transit)
  * `/services/packing-unpacking` (Multi-layer materials & packing labor)
  * `/services/loading-unloading` (Heavy item handling & equipment)
  * `/services/warehousing-storage` (Short & long term safe storage)
  * `/services/goods-insurance` (Transit insurance & claims assistance)

* **Site Search & Utility (1 page)**:
  * `/search` (Instant search across all services, cities, and corridors)

---

## 🛠️ Tech Stack

* **Frontend**: React 19, Vite, React Router 7
* **Styling**: Tailwind CSS v4, CSS Custom Properties
* **State Management**: Redux Toolkit
* **Animation & Motion**: GSAP, Framer Motion, Lenis Smooth Scroll
* **SEO**: `react-helmet-async`, structured data (`LocalBusiness`, `MovingCompany`, `Service`, `FAQPage`, `BreadcrumbList`)
* **Icons**: `lucide-react`, `react-icons/fa6`

---

## 📍 Single Source of Truth Architecture

To ensure data integrity, no operational details or rates are hardcoded inside components:
* `src/data/company.js`: All company facts, primary phone, WhatsApp, head office address, business hours, and social links.
* `src/data/pricing.js`: Central pricing engine with local shifting rates, interstate corridors, vehicle transport, and estimator configs.
* `src/data/locations/`: Granular regional modules (`bihar.js`, `jharkhand.js`, `uttar-pradesh.js`, `delhi-ncr.js`, `west-bengal.js`, `interstate-routes.js`).

---

## 🚀 Running Locally

```bash
# Navigate to the website workspace
cd frontend/website

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
