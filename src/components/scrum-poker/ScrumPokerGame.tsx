import { Button, Card, Center, Grid, Group, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconPlayerPlay, IconPlayerStop } from "@tabler/icons";
import React, { useEffect, useState } from "react";

import { ScrumPokerSessionUser, ScrumPokerSessionUserTable } from "../../models/supabaseEntities";
import { useAuth } from "../../utilities/authProvider";
import { supabase } from "../../utilities/supabase";
import Team from "../Team";

type ScrumPokerGameProps = {
  sessionID: string;
};

const ScrumPokerGame: React.FC<ScrumPokerGameProps> = ({ sessionID }) => {
  const user = useAuth();
  const [sessionUserVotes, setSessionUserVotes] = useState<ScrumPokerSessionUser[]>([]);

  const createSessionUser = async () => {
    const { error } = await supabase
      .from<ScrumPokerSessionUser>(ScrumPokerSessionUserTable)
      .upsert({ user_id: user?.id, session_id: sessionID! });

    if (error) {
      showNotification({
        title: "Session User Error",
        message: error.message,
        color: "red",
      });

      return;
    }
  };

  const getSessionUserVotes = async () => {
    const { data, error } = await supabase
      .from<ScrumPokerSessionUser>(ScrumPokerSessionUserTable)
      .select(
        `
        session_id,
        user_id,
        vote,
        is_voted
      `
      )
      .eq("session_id", sessionID!);

    if (error) {
      showNotification({
        title: "Session User Error",
        message: error.message,
        color: "red",
      });

      return;
    }
    setSessionUserVotes(data);
  };

  useEffect(() => {
    createSessionUser();
    getSessionUserVotes();

    const mySubscription = supabase
      .from(`${ScrumPokerSessionUserTable}:session_id=eq.${sessionID}`)
      .on("*", (payload) => {
        console.log("Change received!", payload);

        const item = sessionUserVotes.find((object) => {
          return object.user_id === payload.new.user_id;
        });

        console.log(item);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(mySubscription);
    };
  }, []);

  return (
    <Group position="center" grow>
      <Grid style={{ minWidth: 750 }}>
        {[1, 2, 3, 5, 8, 13, 21, 34, 55].map((score, index) => (
          <Grid.Col span={3} key={index} style={{ maxWidth: 500, minWidth: 250 }}>
            <Card radius="md" withBorder>
              <Center>
                <Text size={100}>{score}</Text>
              </Center>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
      <div style={{ minWidth: 250, maxWidth: 750 }}>
        <Center>
          <Button.Group>
            <Button
              size="lg"
              variant="outline"
              color="cyan"
              leftIcon={<IconPlayerPlay size={14} />}
            >
              Start Game
            </Button>
            <Button size="lg" variant="outline" color="green" leftIcon={<IconCheck size={14} />}>
              Show Vote
            </Button>
            <Button size="lg" variant="outline" color="red" leftIcon={<IconPlayerStop size={14} />}>
              Finish Game
            </Button>
          </Button.Group>
        </Center>

        <Team sessionUserVotes={sessionUserVotes} />
      </div>
    </Group>
  );
};

export default ScrumPokerGame;
