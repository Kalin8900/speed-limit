import { FC, useDeferredValue, useMemo } from "react";
import { IGeolocation } from "../hooks/useGeolocation";
import { SpeedLimitNode, SpeedLimitWay } from "../types/speedLimit";
import { Feature, LineString, lineString, pointToLineDistance } from "@turf/turf";
import { Card, Group, Text, Title, Badge, Alert } from "@mantine/core";
import { AlertCircle } from "tabler-icons-react";

interface ISpeedLimitProps {
  elements: (SpeedLimitWay | SpeedLimitNode)[];
  location: IGeolocation;
}

const getWaysWithLines = (ways: (SpeedLimitWay | SpeedLimitNode)[]) => {
  const waysWithLines: Array<{ way: SpeedLimitWay; line: Feature<LineString> | null }> = [];
  const nodes: Record<number, SpeedLimitNode> = {};

  for (const element of ways) {
    if (element.type === "node") {
      nodes[element.id] = element;
    } else if (element.type === "way") {
      if (element.tags.maxspeed) waysWithLines.push({ way: element, line: null });
    }
  }

  for (const elem of waysWithLines) {
    elem.line = lineString(elem.way.nodes.map((nodeId) => [nodes[nodeId].lon, nodes[nodeId].lat]));
  }

  return waysWithLines;
};

export const SpeedLimit: FC<ISpeedLimitProps> = ({ elements, location }) => {
  const defWays = useDeferredValue(elements);

  const waysWithLines = useMemo(() => {
    return getWaysWithLines(defWays);
  }, [defWays]);

  const nearest = waysWithLines.reduce(
    (acc, curr) => {
      if (!curr.line || !location.coords) return acc;

      const distance = pointToLineDistance([location.coords.latitude, location.coords.longitude], curr.line);

      if (distance < acc.distance) {
        return { distance, way: curr.way };
      }

      return acc;
    },
    { way: null, distance: Infinity } as { way: SpeedLimitWay | null; distance: number }
  );

  if (!nearest.way)
    return (
      <Alert title={"No data"} color={"red"} icon={<AlertCircle />}>
        <Text> No data for your location </Text>
      </Alert>
    );

  if (!location.coords || !nearest.way.tags.maxspeed)
    return (
      <Card shadow={"sm"} p={"lg"} radius={"md"} withBorder>
        <Card.Section m={"lg"} mt={"xl"}>
          <Title order={2}>{location?.coords?.speed || 0} km/h</Title>
        </Card.Section>
        <Card.Section m={"lg"} mt={"xl"}>
          <Title order={3}>NaN km/h</Title>
        </Card.Section>
        <Group position="apart" mt="md" mb="xs">
          <Text>{nearest.way?.tags.name}</Text>
          <Badge>{nearest.way?.tags.highway}</Badge>
        </Group>
      </Card>
    );

  return (
    <Card shadow={"sm"} p={"lg"} radius={"md"} withBorder>
      <Card.Section m={"lg"} mt={"xl"}>
        <Title
          order={2}
          color={
            location.coords.speed !== null && location.coords.speed > Number(nearest.way?.tags.maxspeed)
              ? "red"
              : "white"
          }
        >
          {location.coords.speed || 0} km/h
        </Title>
      </Card.Section>
      <Card.Section m={"lg"} mt={"xl"}>
        <Title order={3}>{nearest.way?.tags.maxspeed} km/h</Title>
      </Card.Section>
      <Group position="apart" mt="md" mb="xs">
        <Text>{nearest.way?.tags.name}</Text>
        <Badge>{nearest.way?.tags.highway}</Badge>
      </Group>
    </Card>
  );
};
