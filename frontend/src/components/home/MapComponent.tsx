import { WithClassName } from "@/types/WithClassName";
import { cn } from "@/lib/utils";
import proj4 from 'proj4';

interface Props extends WithClassName {
	lat?: number | null;
	lon?: number | null;
	src: string;
}

interface UTMCoordinates {
  x: number;
  y: number;
}

const EPSG_4326 = 'EPSG:4326';
const EPSG_25832 = '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs';

proj4.defs('EPSG:25832', EPSG_25832);

const convertToEPSG25832 = (lon: number, lat: number): UTMCoordinates => {
	try {
		const [x, y] = proj4(EPSG_4326, EPSG_25832, [lon, lat]);

		// round to nearest meter since epsg 25832 works in Meters
		return {
			x: Math.round(x),
			y: Math.round(y)
		}
	} catch (error) {
		console.error('Error converting coordinates:', error);
		throw new Error(`Failed to convert coordinates: lon=${lon}, lat=${lat}`);
	}
}

const isValidCoordinates = (lon: number, lat: number): boolean => {
	return (
		typeof lon === 'number' &&
		typeof lat === 'number' &&
		!isNaN(lon) &&
		!isNaN(lat) &&
		lon >= -180 &&
    lon <= 180 &&
    lat >= -90 &&
    lat <= 90
	);
}

export const MapComponent = ({ src, lat, lon, className }: Props) => {
	const hasValidCoords = lat != null && lon != null && isValidCoordinates(lon, lat);

  const iframeSrc = (() => {
    if (!hasValidCoords) {
      return src;
    }

    try {
      const { x, y } = convertToEPSG25832(lon, lat);
      
      const params = new URLSearchParams({
        MARKER: `${x},${y}`,
        PROJECTION: 'EPSG:25832',
        CENTER: `${x},${y}`,
        ZOOMLEVEL: '3'
      });
      
      return `${src}?${params.toString()}`;
    } catch (error) {
      console.error('Error building map URL:', error);
      return src;
    }
  })();

	return <div className={cn("h-auto w-full flex-1", className)}>
		<iframe
			className="overflow-hidden border-none h-full w-full"
			src={iframeSrc}
			height="100%"
			width="100%"
		></iframe>
	</div>
}
