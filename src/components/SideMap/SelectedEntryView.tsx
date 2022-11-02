import { Place } from "@prisma/client";

interface SelectedEntryViewProps {
  selectedEntry: Place | undefined;
}

export default function SelectedEntryView({
  selectedEntry,
}: SelectedEntryViewProps) {
  return selectedEntry ? (
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
              <span key={index} className="badge bg-secondary-600 px-3">
                {tag}
              </span>
            );
          })}
        </div>
      </div>

      {selectedEntry.description ? (
        <>
          <div className="divider before:bg-secondary after:bg-secondary">
            Description
          </div>
          <p className="text-lg">{selectedEntry.description}</p>
        </>
      ) : null}
      {selectedEntry.phone_number || selectedEntry.website ? (
        <>
          <div className="divider before:bg-secondary after:bg-secondary">
            Contact Information
          </div>
          {selectedEntry.phone_number ? (
            <p>Phone: {selectedEntry.phone_number}</p>
          ) : null}
          {selectedEntry.website ? (
            <p>
              Website:{" "}
              <a
                href={selectedEntry.website}
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
            Opening Hours
          </div>
          {selectedEntry.opening_hours.split(",").map((day, index) => (
            <p key={index}>{day.trim()}</p>
          ))}
        </>
      ) : null}
    </div>
  ) : null;
}
