import { City } from 'services/api-city.type';

interface SearchCityItemProps {
  letter: string;
  cities: City[];
  handleSelectCity: (city: City) => void;
  citySelected: Partial<City>;
}
export function SearchCityItem({ letter, cities, handleSelectCity, citySelected }: SearchCityItemProps) {
  return (
    <div className="flex full-width search-city-item">
      <span className="mr-4 text-gray-400">{letter}</span>
      <div>
        <ul className="list-city-result">
          {cities?.map((x: City, idx) => (
            <li key={idx}>
              <span
                className={`text-gray-700 ${x._id === citySelected._id ? 'selected-city' : ''}`}
                onClick={() => handleSelectCity(x)}
              >
                {x?.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
