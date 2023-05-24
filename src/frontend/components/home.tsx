import {
  Avatar,
  Button,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelBody,
  DrawerPanelContent,
  Page,
  PageSection,
  SearchInput,
  SkipToContent,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import { EditIcon } from "@patternfly/react-icons";

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
            <DrawerContentBody className="pf-u-p-lg">Body</DrawerContentBody>
          </DrawerContent>
        </Drawer>
      </PageSection>
    </Page>
  );
}
