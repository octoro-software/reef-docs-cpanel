// hooks/useApexDiscovery.ts
import { useEffect, useState } from "react";
import Zeroconf from "react-native-zeroconf";

type DiscoveredDevice = {
  name: string;
  host: string;
  port: number;
};

export const useDeviceDiscovery = () => {
  const [devices, setDevices] = useState<DiscoveredDevice[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const zeroconf = new Zeroconf();

    const handleResolved = (service: any) => {
      // Filter here if you need – e.g. by service.name or txt records
      setDevices((prev) => {
        const exists = prev.some(
          (d) => d.host === service.host && d.port === service.port
        );
        if (exists) return prev;
        return [
          ...prev,
          {
            name: service.name || "Unknown Device",
            host: service.host,
            port: service.port,
          },
        ];
      });
    };

    zeroconf.on("resolved", handleResolved);

    return () => {
      try {
        zeroconf.removeListener("resolved", handleResolved);
        zeroconf?.stop();
        zeroconf?.end();
      } catch (error) {}
    };
  }, []);

  const scan = () => {
    setDevices([]);
    setLoading(true);
    const zeroconf = new Zeroconf();

    zeroconf.on("stop", () => setLoading(false));

    // Typical HTTP mDNS service. You may need to adjust type/name/domain
    zeroconf.scan("http", "tcp", "local.");

    // Stop after 5s
    setTimeout(() => {
      zeroconf.stop();
    }, 5000);
  };

  return { devices, loading, scan };
};
