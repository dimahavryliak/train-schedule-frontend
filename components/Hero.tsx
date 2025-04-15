"use client";

import { useState, useEffect, useRef } from "react";
import { fetchTrains, Train } from "@/api/trainApi";
import TrainCardList from "@/components/TrainCardList";

const cities = [
  "Київ",
  "Харків",
  "Одеса",
  "Дніпро",
  "Донецьк",
  "Запоріжжя",
  "Львів",
  "Кривий Ріг",
  "Миколаїв",
  "Маріуполь",
  "Вінниця",
  "Херсон",
  "Полтава",
  "Чернігів",
  "Черкаси",
  "Суми",
  "Житомир",
  "Хмельницький",
  "Чернівці",
  "Рівне",
  "Івано-Франківськ",
  "Тернопіль",
  "Луцьк",
  "Ужгород",
];

export default function Hero() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [filteredCitiesFrom, setFilteredCitiesFrom] = useState<string[]>([]);
  const [filteredCitiesTo, setFilteredCitiesTo] = useState<string[]>([]);
  const [trains, setTrains] = useState<Train[]>([]);
  const [filteredTrains, setFilteredTrains] = useState<Train[]>([]);
  const fromDropdownRef = useRef<HTMLUListElement | null>(null);
  const toDropdownRef = useRef<HTMLUListElement | null>(null);

  const handleInputChange = (
    value: string,
    setFilteredCities: (cities: string[]) => void,
    setValue: (value: string) => void
  ) => {
    setValue(value);
    setFilteredCities(
      cities.filter((city) => city.toLowerCase().includes(value.toLowerCase()))
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        fromDropdownRef.current &&
        !fromDropdownRef.current.contains(event.target as Node) &&
        event.target !== document.getElementById("from")
      ) {
        setFilteredCitiesFrom([]);
      }

      if (
        toDropdownRef.current &&
        !toDropdownRef.current.contains(event.target as Node) &&
        event.target !== document.getElementById("to")
      ) {
        setFilteredCitiesTo([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fromDropdownRef, toDropdownRef]);

  useEffect(() => {
    fetchTrains()
      .then((data) => {
        setTrains(data);
        setFilteredTrains(data);
      })
      .catch((error) => console.error("Error fetching trains:", error));
  }, []);

  useEffect(() => {
    let filtered = trains;

    if (from) {
      filtered = filtered.filter((train) =>
        train.departure.toLowerCase().includes(from.toLowerCase())
      );
    }

    if (to) {
      filtered = filtered.filter((train) =>
        train.arrival.toLowerCase().includes(to.toLowerCase())
      );
    }

    if (date) {
      filtered = filtered.filter(
        (train) => new Date(train.date).toISOString().split("T")[0] === date
      );
    }

    setFilteredTrains(filtered);
  }, [from, to, date, trains]);

  return (
    <div className=" flex flex-col lg:flex-row items-start justify-center p-8 gap-8 mt-20 ">
      <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full lg:w-1/2">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Список поїздів
        </h2>
        <TrainCardList trains={filteredTrains} />
      </div>

      <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full lg:w-1/2">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Пошук поїздів
        </h2>
        <form className="space-y-6">
          <div className="relative">
            <label
              htmlFor="from"
              className="block mb-2 text-sm text-gray-700 font-semibold"
            >
              Звідки
            </label>
            <input
              type="text"
              id="from"
              value={from}
              onChange={(e) =>
                handleInputChange(
                  e.target.value,
                  setFilteredCitiesFrom,
                  setFrom
                )
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700"
              placeholder="Наприклад: Київ"
            />
            {filteredCitiesFrom.length > 0 && (
              <ul
                ref={fromDropdownRef}
                className="bg-white border border-gray-300 rounded-lg mt-2 max-h-40 overflow-y-auto absolute z-10 w-full shadow-md text-black"
              >
                {filteredCitiesFrom.map((city) => (
                  <li
                    key={city}
                    onClick={() => {
                      setFrom(city);
                      setFilteredCitiesFrom([]);
                    }}
                    className="p-2 cursor-pointer hover:bg-blue-100"
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="to"
              className="block mb-2 text-sm text-gray-700 font-semibold"
            >
              Куди
            </label>
            <input
              type="text"
              id="to"
              value={to}
              onChange={(e) =>
                handleInputChange(e.target.value, setFilteredCitiesTo, setTo)
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700"
              placeholder="Наприклад: Львів"
            />
            {filteredCitiesTo.length > 0 && (
              <ul
                ref={toDropdownRef}
                className="bg-white border border-gray-300 rounded-lg mt-2 max-h-40 overflow-y-auto absolute z-10 w-full shadow-md text-black"
              >
                {filteredCitiesTo.map((city) => (
                  <li
                    key={city}
                    onClick={() => {
                      setTo(city);
                      setFilteredCitiesTo([]);
                    }}
                    className="p-2 cursor-pointer hover:bg-blue-100"
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label
              htmlFor="date"
              className="block mb-2 text-sm text-gray-700 font-semibold"
            >
              Коли
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
