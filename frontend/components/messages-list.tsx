import {
  List,
  ListItem,
  Card,
  CardBody,
  EmptyState,
  EmptyStateVariant,
  EmptyStateBody,
  Skeleton,
} from "@patternfly/react-core";
import { RefObject, Fragment } from "react";

export const MessagesList = ({
  messages,
  lastMessageRef,
}: {
  messages?: {
    them?: boolean;
    body: string;
    date: Date;
  }[];
  lastMessageRef: RefObject<HTMLSpanElement> | undefined;
}) => (
  <List isPlain>
    {messages ? (
      messages.length > 0 ? (
        messages.map((message, i) => (
          <Fragment key={i}>
            <ListItem>
              <Card
                isCompact
                isRounded
                className={
                  "pf-c-card--message " +
                  (message.them ? "pf-c-card--them" : "pf-c-card--us")
                }
              >
                <CardBody>{message.body}</CardBody>
              </Card>
            </ListItem>

            {(messages[i + 1] &&
              Math.abs(
                message.date.getTime() - messages[i + 1].date.getTime()
              ) /
                (1000 * 60 * 60) >
                2) ||
            i === messages.length - 1 ? (
              <ListItem>
                <span
                  ref={i === messages.length - 1 ? lastMessageRef : undefined}
                  className="pf-c-date"
                >
                  {`Today ${message.date
                    .getHours()
                    .toString()
                    .padStart(2, "0")}:${message.date
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}`}
                </span>
              </ListItem>
            ) : null}
          </Fragment>
        ))
      ) : (
        <ListItem>
          <EmptyState variant={EmptyStateVariant.xs}>
            <EmptyStateBody className="pf-u-mt-0">
              No messages yet
            </EmptyStateBody>
          </EmptyState>
        </ListItem>
      )
    ) : (
      <>
        <ListItem>
          <Skeleton screenreaderText="Loading messages" width="90%" />
        </ListItem>

        <ListItem>
          <Skeleton screenreaderText="Loading messages" width="66%" />
        </ListItem>

        <ListItem>
          <Skeleton screenreaderText="Loading messages" width="77%" />
        </ListItem>

        <ListItem>
          <Skeleton screenreaderText="Loading messages" width="33%" />
        </ListItem>

        <ListItem className="pf-u-mt-3xl">
          <Skeleton
            screenreaderText="Loading messages"
            width="66%"
            className="pf-u-ml-auto"
          />
        </ListItem>

        <ListItem>
          <Skeleton
            screenreaderText="Loading messages"
            width="33%"
            className="pf-u-ml-auto"
          />
        </ListItem>
      </>
    )}
  </List>
);
