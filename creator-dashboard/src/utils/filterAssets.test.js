import { filterAssets } from "../components/home/filterAssets";

describe("filterAssets", () => {
  const assets = [
    {
      id: 1,
      name: "Logo Design",
      type: "image",
      tags: ["branding"],
      size: 200,
      created_on: "2024-01-01",
    },
    {
      id: 2,
      name: "Intro Video",
      type: "video",
      tags: ["promo"],
      size: 500,
      created_on: "2024-02-01",
    },
  ];

  it("filters by search query", () => {
    const result = filterAssets({
      assets,
      searchQuery: "logo",
      filterType: "all",
      sortBy: "created_on",
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Logo Design");
  });

  it("filters by type", () => {
    const result = filterAssets({
      assets,
      searchQuery: "",
      filterType: "video",
      sortBy: "created_on",
    });

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("video");
  });
});
