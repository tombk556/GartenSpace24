import requests
import random
from decimal import Decimal

# --------------------------
API_BASE_URL = "http://localhost:8000"  # Adjust to your server’s URL
CREATE_ENTITY_ENDPOINT = f"{API_BASE_URL}/entities/create_entity"
UPLOAD_IMAGE_ENDPOINT = f"{API_BASE_URL}/entities/upload"
IMAGE_FILE_PATH = "/Users/tom/Documents/ELTS/Bilder/"
TOKEN = ""
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json",
}

countries = [
    "Baden-Württemberg",
    "Bayern",
    "Berlin",
    "Brandenburg",
    "Bremen",
    "Hamburg",
    "Hessen",
    "Mecklenburg-Vorpommern",
    "Niedersachsen",
    "Nordrhein-Westfalen",
    "Rheinland-Pfalz",
    "Saarland",
    "Sachsen",
    "Sachsen-Anhalt",
    "Schleswig-Holstein",
    "Thueringen",
]

offers = ["Mieten", 
          "Kaufen", 
          "Pachten"]

properties_available = [
    "Schuppen",
    "Grillstelle",
    "Garage",
    "Garten",
    "Swimmingpool",
    "Balkon",
    "Carport",
    "Fitnessraum",
    "Terrasse",
    "Kamin",
    "Spielplatz",
]

german_cities_plz = [
    {"city": "Berlin", "plz": "10115"},
    {"city": "Hamburg", "plz": "20095"},
    {"city": "München", "plz": "80331"},
    {"city": "Köln", "plz": "50667"},
    {"city": "Frankfurt am Main", "plz": "60311"},
    {"city": "Stuttgart", "plz": "70173"},
    {"city": "Düsseldorf", "plz": "40213"},
    {"city": "Leipzig", "plz": "04109"},
    {"city": "Dortmund", "plz": "44135"},
    {"city": "Essen", "plz": "45127"},
    {"city": "Bremen", "plz": "28195"},
    {"city": "Dresden", "plz": "01067"},
    {"city": "Hannover", "plz": "30159"},
    {"city": "Nürnberg", "plz": "90402"},
    {"city": "Duisburg", "plz": "47051"},
    {"city": "Bochum", "plz": "44787"},
    {"city": "Wuppertal", "plz": "42103"},
    {"city": "Bielefeld", "plz": "33602"},
    {"city": "Bonn", "plz": "53111"},
    {"city": "Mannheim", "plz": "68159"},
    {"city": "Karlsruhe", "plz": "76133"},
    {"city": "Wiesbaden", "plz": "65183"},
    {"city": "Münster", "plz": "48143"},
    {"city": "Gelsenkirchen", "plz": "45879"},
    {"city": "Augsburg", "plz": "86150"},
    {"city": "Mönchengladbach", "plz": "41061"},
    {"city": "Aachen", "plz": "52062"},
    {"city": "Braunschweig", "plz": "38100"},
    {"city": "Chemnitz", "plz": "09111"},
    {"city": "Kiel", "plz": "24103"},
]

german_streets = [
    "Hauptstraße",
    "Bahnhofstraße",
    "Schillerstraße",
    "Lindenstraße",
    "Goethestraße",
    "Ringstraße",
    "Gartenweg",
    "Dorfstraße",
    "Neue Straße",
    "Bergstraße",
    "Bautznerstraße",
    "Friedrichstraße",
    "Münchnerstraße",
    "Bachstraße",
    "Birkenstraße",
    "Rosenstraße",
    "Blauestraße",
    "Weißstraße",
    "Schwarzstraße",
    "Grafenstraße",
    "Kaiserstraße",
    "Kurfürststraße",
    "Kunststraße",
    "Museumstraße",
    "Birkenallee",
    "Rosenallee",
    "Blauallee",
    "Weißallee",
    "Schwarzallee",
    "Grafenallee",
    "Kaiserallee",
    "Kurfürstallee",
    ]

descriptions = [
        "Tolles Grundstück mitten im Grünen.",
        "Ideal für Familien und Naturliebhaber.",
        "Ruhige Lage, perfekt zum Abschalten.",
        "Modernes Gartengrundstück mit vielen Extras.",
        "Ein Paradies für Hobby-Gärtner.",
        "Perfekt für Grillpartys mit Freunden!",
        "Kleingarten-Oase in Stadtnähe.",
        "Gut erschlossen, mit Wasser- und Stromanschluss.",
        "Blick auf den See, einfach traumhaft.",
        "Umsäumt von Bäumen – wunderbar schattig."
    ]

def generate_random_street_name():
    """
    Pick a random (realistic) German street name, then append a house number.
    """
    street = random.choice(german_streets)
    house_number = random.randint(1, 200)
    return f"{street} {house_number}"


def generate_random_city_and_plz():
    """
    Select a random entry from our 30 German city/PLZ pairs.
    Returns a dict with {"city": <cityName>, "plz": <plz>}.
    """
    return random.choice(german_cities_plz)

def generate_random_description():
    """Generate a random short description, up to 100 characters."""

    return random.choice(descriptions)


def generate_random_entity_data():
    size = random.randint(50, 5000)

    price = Decimal(random.uniform(50, 999999.99)).quantize(Decimal("0.01"))

    price_str = str(price).replace('.', ',')

    country = random.choice(countries)
    offer = random.choice(offers)

    chosen_properties = random.sample(properties_available, k=random.randint(1, 5))

    city_plz_entry = generate_random_city_and_plz()

    return {
        "address": {
            "country": country,
            "city": city_plz_entry["city"],
            "plz": city_plz_entry["plz"],
            "street": generate_random_street_name(),
        },
        "meta": {
            "size": size,
            "price": price_str,        
            "offer": offer,
            "description": generate_random_description(),
        },
        "properties": chosen_properties
    }


def main():
    num_entities_to_create = 500

    for _ in range(num_entities_to_create):
        entity_data = generate_random_entity_data()

        print(f"Creating new entity with data:\n{entity_data}\n")
        create_response = requests.post(
            CREATE_ENTITY_ENDPOINT,
            json=entity_data,
            headers=HEADERS,
        )
        if create_response.status_code != 201:
            print(f"Failed to create entity: {create_response.status_code} {create_response.text}")
            continue

        created_info = create_response.json()  # e.g. {"id": "<uuid>"}
        entity_id = created_info["id"]
        print(f"Created entity with ID: {entity_id}\n")

        for _ in range(10):
            i = random.randint(1, 13)
            file = f"{IMAGE_FILE_PATH}bild{i}.png"
            with open(file, "rb") as f:
                files = {"file": (file, f, "image/png")}
                upload_response = requests.put(
                    f"{UPLOAD_IMAGE_ENDPOINT}/{entity_id}",
                    headers={"Authorization": HEADERS["Authorization"]},
                    files=files,
                )
            if upload_response.status_code != 200:
                print(f"Failed to upload image {i}: {upload_response.status_code} {upload_response.text}")
            else:
                print("Upload successful.")

        print("----------------------------------------------------")


if __name__ == "__main__":
    main()
