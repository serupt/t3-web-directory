import { Place, PlaceImages } from "@prisma/client";
import { useTranslation } from "next-i18next";
import { trpc } from "../../utils/trpc";
import { useState } from "react";
import Image from "next/image";
import ViewAllImage from "../ViewAllImage";

interface SelectedEntryViewProps {
  selectedEntry: Place;
}

export default function SelectedEntryView({
  selectedEntry,
}: SelectedEntryViewProps) {
  const { t } = useTranslation("common");

  const getImage = trpc.images.getPlaceImages.useQuery({
    placeId: selectedEntry.id,
  });

  const [carouselIndex, setCarouselIndex] = useState(0);

  const prevSlide = (placeImage: PlaceImages[]) => {
    const newIndex =
      carouselIndex === 0 ? placeImage.length! - 1 : carouselIndex - 1;
    setCarouselIndex(newIndex);
  };

  const nextSlide = (placeImage: PlaceImages[]) => {
    const newIndex =
      carouselIndex === placeImage.length! - 1 ? 0 : carouselIndex + 1;
    setCarouselIndex(newIndex);
  };

  const [viewAllImage, setViewAllImage] = useState(false);

  return selectedEntry ? (
    <>
      <div className="space-y-2 p-1">
        {/* ------- name and addresses ------- */}
        <h1 className=" text-center text-2xl font-bold">
          {selectedEntry.name}
          <div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${
                selectedEntry.latitude + "," + selectedEntry.longitude
              }`}
              target="_blank"
              rel="noreferrer"
              className="link text-lg text-blue-500"
            >
              {"➥ " + selectedEntry.main_address}
            </a>
          </div>
        </h1>

        {getImage.data && getImage.data.length > 0 ? (
          <div className="flex flex-col space-y-2">
            <div className="carousel w-full ">
              <div className="carousel-item relative h-48 w-full">
                <Image
                  src={
                    getImage.data.at(carouselIndex)?.image_url ||
                    "https://picsum.photos/200/300"
                  }
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                  <button onClick={() => prevSlide(getImage.data)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                      />
                    </svg>
                  </button>
                  <button onClick={() => nextSlide(getImage.data)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setViewAllImage(true)}
              className="btn-sm rounded bg-secondary-700 hover:bg-secondary-600"
            >
              View All Images
            </button>
          </div>
        ) : null}

        {selectedEntry.other_addresses[0] ? (
          <>
            <div className="divider before:bg-secondary after:bg-secondary">
              Additional Locations
            </div>
            {selectedEntry.other_addresses.map((address, index) => {
              return <h2 key={index}>{address}</h2>;
            })}
          </>
        ) : null}
        {/* -------- category and tags ------- */}
        <div className="divider before:bg-secondary after:bg-secondary"></div>
        <div className="space-y-3 p-3 text-center">
          <h1 className="text-2xl">{selectedEntry.category}</h1>
          <div className="space-x-1">
            {selectedEntry.tags.sort().map((tag, index) => {
              return (
                <span
                  key={index}
                  className="badge bg-secondary-600 px-3 text-white"
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </div>

        {selectedEntry.description ? (
          <>
            <div className="divider before:bg-secondary after:bg-secondary">
              {t("description")}
            </div>
            <p className="text-lg">{selectedEntry.description}</p>
          </>
        ) : null}
        {selectedEntry.phone_number || selectedEntry.website ? (
          <>
            <div className="divider before:bg-secondary after:bg-secondary">
              {t("contact")}
            </div>
            {selectedEntry.phone_number ? (
              <p>
                {t("phone")}: {selectedEntry.phone_number}
              </p>
            ) : null}
            {selectedEntry.email ? (
              <p>
                {t("email")}: {selectedEntry.email}
              </p>
            ) : null}
            {selectedEntry.website ? (
              <p>
                {t("website")}:{" "}
                <a
                  href={selectedEntry.website}
                  target="_blank"
                  rel="noreferrer"
                  className="link text-center text-lg text-blue-500"
                >
                  {selectedEntry.website}
                </a>
              </p>
            ) : null}
          </>
        ) : null}
        {selectedEntry.opening_hours ? (
          <>
            <div className="divider before:bg-secondary after:bg-secondary">
              {t("opening_hours")}
            </div>
            {selectedEntry.opening_hours.split(",").map((day, index) => (
              <p key={index}>{day.trim()}</p>
            ))}
          </>
        ) : null}
      </div>
      {getImage.data && getImage.data.length > 0 ? (
        <ViewAllImage
          viewAllImage={viewAllImage}
          setViewAllImage={setViewAllImage}
          entryImages={getImage.data}
          entryName={selectedEntry.name}
        />
      ) : null}
    </>
  ) : null;
}
