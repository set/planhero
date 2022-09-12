import { Card, Center, Container, Grid, Stack, Text } from "@mantine/core";
import Team from "../Team";

interface IScrumPokerGameProps {
  sessionID: string;
}

const ScrumPokerGame: React.FC<IScrumPokerGameProps> = ({ sessionID }) => {
  console.log("sessionID", sessionID);
  return (
    <Stack>
      <Grid>
        {[1, 2, 3, 5, 8, 13, 21, 34].map((score, index) => {
          return (
            <Grid.Col span={3} key={index}>
              <Card radius="md" withBorder>
                <Center>
                  <Text size={100}>{score}</Text>
                </Center>
              </Card>
            </Grid.Col>
          );
        })}
      </Grid>
      <Container style={{ minWidth: 400 }}>
        <Team />
      </Container>
    </Stack>
  );
};

export default ScrumPokerGame;
