import axios from 'axios';

const BASE_URL = 'https://m2m.cr.usgs.gov/api/api/json/stable/';

export const searchLandsatImages = async (longitude, latitude) => {
    const loginResponse = await axios.post(`${BASE_URL}login`, loginPayload);
    const token = loginResponse.data.data;
    const searchPayload = {
      datasetName: 'LANDSAT_8_C2_L2', 
      spatialFilter: {
        filterType: 'mbr',
        lowerLeft: {
          latitude: latitude - 0.1,
          longitude: longitude - 0.1,
        },
        upperRight: {
          latitude: latitude + 0.1,
          longitude: longitude + 0.1,
        },
      },
      maxResults: 5, 
      startingNumber: 1,
      sortOrder: 'DESC', 
      apiKey: token, 
    };
    const searchResponse = await axios.post(`${BASE_URL}scene-search`, searchPayload);

    return searchResponse.data.data.results;
  } catch (error) {
    console.error('Error searching for Landsat images:', error);
    return [];
  }
};
