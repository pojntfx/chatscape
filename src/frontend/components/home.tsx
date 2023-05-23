import Link from "next/link";
import { ReactNode } from "react";
import icon from "../public/logo-header.png";
import {
  Brand,
  Button,
  ButtonVariant,
  Page,
  PageHeader,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
  PageSection,
  SkipToContent,
  ToggleGroup,
  ToggleGroupItem,
} from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

export default function Home() {
  return (
    <Page
      header={
        <PageHeader
          logo={
            <Brand
              src={icon.src}
              alt="ChatScape logo"
              className="pf-c-brand--padding"
            />
          }
          logoComponent={Link as unknown as ReactNode}
          logoProps={{
            href: "/",
          }}
          headerTools={
            <PageHeaderTools>
              <PageHeaderToolsGroup>
                <PageHeaderToolsItem>
                  <Button
                    href="https://github.com/pojntfx/chatscape"
                    component="a"
                    target="_blank"
                    aria-label="Help"
                    variant={ButtonVariant.plain}
                  >
                    <HelpIcon />
                  </Button>
                </PageHeaderToolsItem>
              </PageHeaderToolsGroup>
            </PageHeaderTools>
          }
        />
      }
      skipToContent={
        <SkipToContent href="#main">Skip to content</SkipToContent>
      }
      mainContainerId="main"
    >
      <PageSection>
        <h1>ChatScape</h1>
      </PageSection>
    </Page>
  );
}
