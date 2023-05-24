import {
  Avatar,
  Button,
  Card,
  CardBody,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelBody,
  DrawerPanelContent,
  List,
  ListItem,
  Page,
  PageSection,
  SearchInput,
  SkipToContent,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { EditIcon, EllipsisVIcon } from "@patternfly/react-icons";

export default function Home() {
  return (
    <Page
      className="pf-c-page--background"
      skipToContent={
        <SkipToContent href="#main">Skip to content</SkipToContent>
      }
      mainContainerId="main"
    >
      <PageSection
        className="pf-u-p-0 pf-c-page__main-section--transparent"
        id="main"
      >
        <Drawer isExpanded isInline position="left">
          <DrawerContent
            panelContent={
              <DrawerPanelContent
                className="pf-c-drawer__panel--transparent"
                widths={{ default: "width_33" }}
              >
                <Toolbar className="pf-u-m-0" isSticky>
                  <ToolbarContent className="pf-u-px-lg">
                    <ToolbarItem className="pf-u-display-flex">
                      <Avatar src="/avatar.svg" alt="avatar" />
                    </ToolbarItem>

                    <ToolbarItem className="pf-u-flex-1">
                      <SearchInput aria-label="Search" placeholder="Search" />
                    </ToolbarItem>

                    <ToolbarItem>
                      <Button variant="plain" aria-label="edit">
                        <EditIcon />
                      </Button>
                    </ToolbarItem>
                  </ToolbarContent>
                </Toolbar>

                <DrawerPanelBody>Hi!</DrawerPanelBody>
              </DrawerPanelContent>
            }
          >
            <Toolbar className="pf-u-m-0" isSticky>
              <ToolbarContent className="pf-u-px-lg">
                <ToolbarGroup>
                  <ToolbarItem className="pf-u-display-flex">
                    <span className="pf-u-icon-color-light pf-u-mr-xs">
                      To:
                    </span>{" "}
                    Jane Doe
                  </ToolbarItem>
                </ToolbarGroup>

                <ToolbarGroup
                  alignment={{
                    default: "alignRight",
                  }}
                >
                  <Button variant="plain" aria-label="edit">
                    <EllipsisVIcon />
                  </Button>
                </ToolbarGroup>
              </ToolbarContent>
            </Toolbar>

            <DrawerContentBody className="pf-u-p-lg">
              <List isPlain>
                <ListItem>
                  <Card isCompact isFlat isRounded className="pf-c-card--them">
                    <CardBody>
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Blanditiis dolor hic temporibus nesciunt enim optio,
                      voluptate accusamus, sit eum cumque suscipit rerum, vel
                      quae quas iste doloribus modi ipsa fugit.
                    </CardBody>
                  </Card>
                </ListItem>
                <ListItem>
                  <span className="pf-c-date">Today 16:02</span>
                </ListItem>
                <ListItem>
                  <Card isCompact isFlat isRounded className="pf-c-card--us">
                    <CardBody>
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Blanditiis dolor hic temporibus nesciunt enim optio.
                    </CardBody>
                  </Card>
                </ListItem>
                <ListItem>
                  <Card isCompact isFlat isRounded className="pf-c-card--us">
                    <CardBody>Lorem!</CardBody>
                  </Card>
                </ListItem>
                <ListItem>
                  <Card isCompact isFlat isRounded className="pf-c-card--them">
                    <CardBody>
                      Optio, voluptate accusamus, sit eum cumque suscipit rerum,
                      vel quae quas iste doloribus modi ipsa fugit.
                    </CardBody>
                  </Card>
                </ListItem>
                <ListItem>
                  <span className="pf-c-date">Today 16:10</span>
                </ListItem>
              </List>
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
      </PageSection>
    </Page>
  );
}
