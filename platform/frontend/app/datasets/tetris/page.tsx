import React from "react";

const page = () => {
  const metadata = {
    records: 1000,
    features: ["Level", "Lines Cleared", "Score", "Time Played"],
    source: "Tetris Championship 2023",
    lastUpdated: "January 25, 2024",
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-4">Tetris Dataset Metadata</h1>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-2">Dataset Overview</h2>
            <ul className="list-disc list-inside">
              <li>
                <strong>Records:</strong> {metadata.records}
              </li>
              <li>
                <strong>Features:</strong> {metadata.features.join(", ")}
              </li>
              <li>
                <strong>Source:</strong> {metadata.source}
              </li>
              <li>
                <strong>Last Updated:</strong> {metadata.lastUpdated}
              </li>
            </ul>
          </div>
        </main>
      </div>
    </>
  );
};

export default page;
