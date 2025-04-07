import axios from 'axios';

// Hàm lấy dữ liệu Prometheus (instant query)
export const fetchPrometheusMetric = async (metricName) => {
    try {
        const response = await axios.get('http://localhost:9090/api/v1/query', {
            params: {
                query: metricName,
            },
        });
        const result = response.data?.data?.result;


        console.log(result);
        

        if (result && result.length > 0) {
            // const value = parseFloat(result[0].value[1]);
            return result;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error fetching metric ${metricName}:`, error);
        return null;
    }
};

// Hàm lấy dữ liệu Prometheus (instant query)
export const fetchPrometheusMetricRange = async (metricName, startTime, endTime, step = "1m") => {
    try {
        const response = await axios.get('http://localhost:9090/api/v1/query_range', {
            params: {
                query: metricName,
                start: startTime,
                end: endTime,
                step: step
            },
        });

        // console.log(response);

        const result = response.data?.data?.result;

        if (result && result.length > 0) {
            const timeSeries = result[0];  // Lấy dữ liệu từ 1 time series

            const data = timeSeries.values.map((point) => {
                // Kiểm tra point có hợp lệ trước khi truy cập
                if (point && point.length > 1) {
                    return {
                        timestamp: new Date(point[0] * 1000),  // Convert timestamp to JS Date object
                        value: parseFloat(point[1]),  // Giá trị trả về
                    };
                } else {
                    return null;  // Nếu dữ liệu không hợp lệ, trả về null
                }
            }).filter(point => point !== null);  // Loại bỏ các null từ dữ liệu

            return data;
        } else {
            return [];
        }
    } catch (error) {
        console.error(`Error fetching metric ${metricName}:`, error);
        return null;
    }
};
