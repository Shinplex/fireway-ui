"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Website {
  id: string
  name: string
  waytectEnabled: boolean
  domains: {
    id: string
    domain: string
  }[]
  waytectPaths: {
    id: string
    path: string
  }[]
  firewallRules: {
    id: string
    pattern: string
  }[]
  origins: {
    id: string
    host: string
    protocol: string
    port: number | null
  }[]
}

interface WebsiteTabsProps {
  website: Website
}

const generalFormSchema = z.object({
  name: z.string().min(2, {
    message: "Website name must be at least 2 characters.",
  }),
})

const domainsFormSchema = z.object({
  domains: z
    .array(
      z.object({
        id: z.string().optional(),
        domain: z.string().min(3, {
          message: "Domain must be at least 3 characters.",
        }),
      }),
    )
    .min(1, {
      message: "At least one domain is required.",
    }),
})

const waytectFormSchema = z.object({
  waytectEnabled: z.boolean(),
  waytectPaths: z.array(
    z.object({
      id: z.string().optional(),
      path: z.string().min(1, {
        message: "Path must not be empty.",
      }),
    }),
  ),
})

const firewallFormSchema = z.object({
  firewallRules: z.array(
    z.object({
      id: z.string().optional(),
      pattern: z.string().min(1, {
        message: "Pattern must not be empty.",
      }),
    }),
  ),
})

const originsFormSchema = z.object({
  origins: z.array(
    z.object({
      id: z.string().optional(),
      host: z.string().min(1, {
        message: "Host is required.",
      }),
      protocol: z.enum(["http", "https"]),
      port: z.number().nullable(),
    })
  ).min(1, {
    message: "At least one origin is required.",
  }),
})

export function WebsiteTabs({ website }: WebsiteTabsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isGeneralLoading, setIsGeneralLoading] = useState(false)
  const [isDomainsLoading, setIsDomainsLoading] = useState(false)
  const [isWaytectLoading, setIsWaytectLoading] = useState(false)
  const [isFirewallLoading, setIsFirewallLoading] = useState(false)
  const [isOriginsLoading, setIsOriginsLoading] = useState(false)

  const generalForm = useForm<z.infer<typeof generalFormSchema>>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      name: website.name,
    },
  })

  const domainsForm = useForm<z.infer<typeof domainsFormSchema>>({
    resolver: zodResolver(domainsFormSchema),
    defaultValues: {
      domains:
        website.domains.length > 0
          ? website.domains.map((domain) => ({ id: domain.id, domain: domain.domain }))
          : [{ domain: "" }],
    },
  })

  const waytectForm = useForm<z.infer<typeof waytectFormSchema>>({
    resolver: zodResolver(waytectFormSchema),
    defaultValues: {
      waytectEnabled: website.waytectEnabled,
      waytectPaths:
        website.waytectPaths.length > 0 ? website.waytectPaths.map((path) => ({ id: path.id, path: path.path })) : [],
    },
  })

  const firewallForm = useForm<z.infer<typeof firewallFormSchema>>({
    resolver: zodResolver(firewallFormSchema),
    defaultValues: {
      firewallRules:
        website.firewallRules.length > 0
          ? website.firewallRules.map((rule) => ({ id: rule.id, pattern: rule.pattern }))
          : [],
    },
  })

  const originsForm = useForm<z.infer<typeof originsFormSchema>>({
    resolver: zodResolver(originsFormSchema),
    defaultValues: {
      origins: website.origins.length > 0
        ? website.origins.map((origin) => ({
            id: origin.id,
            host: origin.host,
            protocol: origin.protocol,
            port: origin.port,
          }))
        : [{ host: "", protocol: "https", port: null }],
    },
  })

  const {
    fields: domainFields,
    append: appendDomain,
    remove: removeDomain,
  } = useFieldArray({
    control: domainsForm.control,
    name: "domains",
  })

  const {
    fields: waytectFields,
    append: appendWaytect,
    remove: removeWaytect,
  } = useFieldArray({
    control: waytectForm.control,
    name: "waytectPaths",
  })

  const {
    fields: firewallFields,
    append: appendFirewall,
    remove: removeFirewall,
  } = useFieldArray({
    control: firewallForm.control,
    name: "firewallRules",
  })

  const {
    fields: originFields,
    append: appendOrigin,
    remove: removeOrigin,
  } = useFieldArray({
    control: originsForm.control,
    name: "origins",
  })

  async function onGeneralSubmit(values: z.infer<typeof generalFormSchema>) {
    setIsGeneralLoading(true)

    const response = await fetch(`/api/websites/${website.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    setIsGeneralLoading(false)

    if (!response.ok) {
      const error = await response.json()
      return toast({
        title: "Something went wrong.",
        description: error.error || "Your website could not be updated. Please try again.",
        variant: "destructive",
      })
    }

    toast({
      title: "Website updated!",
      description: "Your website has been updated successfully.",
    })

    router.refresh()
  }

  async function onDomainsSubmit(values: z.infer<typeof domainsFormSchema>) {
    setIsDomainsLoading(true)

    const response = await fetch(`/api/websites/${website.id}/domains`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    setIsDomainsLoading(false)

    if (!response.ok) {
      const error = await response.json()
      return toast({
        title: "Something went wrong.",
        description: error.error || "Your domains could not be updated. Please try again.",
        variant: "destructive",
      })
    }

    toast({
      title: "Domains updated!",
      description: "Your website domains have been updated successfully.",
    })

    router.refresh()
  }

  async function onWaytectSubmit(values: z.infer<typeof waytectFormSchema>) {
    setIsWaytectLoading(true)

    const response = await fetch(`/api/websites/${website.id}/waytect`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    setIsWaytectLoading(false)

    if (!response.ok) {
      const error = await response.json()
      return toast({
        title: "Something went wrong.",
        description: error.error || "Your Waytect settings could not be updated. Please try again.",
        variant: "destructive",
      })
    }

    toast({
      title: "Waytect settings updated!",
      description: "Your Waytect settings have been updated successfully.",
    })

    router.refresh()
  }

  async function onFirewallSubmit(values: z.infer<typeof firewallFormSchema>) {
    setIsFirewallLoading(true)

    const response = await fetch(`/api/websites/${website.id}/firewall`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    setIsFirewallLoading(false)

    if (!response.ok) {
      const error = await response.json()
      return toast({
        title: "Something went wrong.",
        description: error.error || "Your firewall rules could not be updated. Please try again.",
        variant: "destructive",
      })
    }

    toast({
      title: "Firewall rules updated!",
      description: "Your firewall rules have been updated successfully.",
    })

    router.refresh()
  }

  async function onOriginsSubmit(values: z.infer<typeof originsFormSchema>) {
    setIsOriginsLoading(true)

    const response = await fetch(`/api/websites/${website.id}/origins`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    setIsOriginsLoading(false)

    if (!response.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your origin settings could not be updated. Please try again.",
        variant: "destructive",
      })
    }

    toast({
      title: "Origins updated.",
      description: "Your origin settings have been updated.",
    })

    router.refresh()
  }

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="domains">Domains</TabsTrigger>
        <TabsTrigger value="origins">Origins</TabsTrigger>
        <TabsTrigger value="waytect">Waytect</TabsTrigger>
        <TabsTrigger value="firewall">Firewall</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="mt-6">
        <Form {...generalForm}>
          <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-8">
            <FormField
              control={generalForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Website" {...field} />
                  </FormControl>
                  <FormDescription>This is the name of your CDN website.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isGeneralLoading}>
              {isGeneralLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </TabsContent>
      <TabsContent value="domains" className="mt-6">
        <Form {...domainsForm}>
          <form onSubmit={domainsForm.handleSubmit(onDomainsSubmit)} className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Domains</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={() => appendDomain({ domain: "" })}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Domain
                </Button>
              </div>
              <FormDescription>
                Add at least one domain. You&apos;ll need to point these domains to way-cdn.turboer.dev.
              </FormDescription>

              {domainFields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-end gap-4">
                      <FormField
                        control={domainsForm.control}
                        name={`domains.${index}.domain`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          if (domainFields.length > 1) {
                            removeDomain(index)
                          }
                        }}
                        disabled={domainFields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button type="submit" disabled={isDomainsLoading}>
              {isDomainsLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </TabsContent>
      <TabsContent value="origins" className="mt-6">
        <Form {...originsForm}>
          <form onSubmit={originsForm.handleSubmit(onOriginsSubmit)} className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Origins</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendOrigin({ host: "", protocol: "https", port: null })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Origin
                </Button>
              </div>
              <FormDescription>
                Add origins for your website. Origins can be IP addresses or domain names.
              </FormDescription>

              {originFields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-end gap-4">
                        <FormField
                          control={originsForm.control}
                          name={`origins.${index}.host`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Host</FormLabel>
                              <FormControl>
                                <Input placeholder="example.com or 1.2.3.4" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={originsForm.control}
                          name={`origins.${index}.protocol`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Protocol</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="http">HTTP</SelectItem>
                                  <SelectItem value="https">HTTPS</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={originsForm.control}
                          name={`origins.${index}.port`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Port (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="80"
                                  className="w-[100px]"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value
                                    field.onChange(value ? parseInt(value) : null)
                                  }}
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (originFields.length > 1) {
                              removeOrigin(index)
                            }
                          }}
                          disabled={originFields.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button type="submit" disabled={isOriginsLoading}>
              {isOriginsLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </TabsContent>
      <TabsContent value="waytect" className="mt-6">
        <Form {...waytectForm}>
          <form onSubmit={waytectForm.handleSubmit(onWaytectSubmit)} className="space-y-8">
            <FormField
              control={waytectForm.control}
              name="waytectEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable Waytect Protection</FormLabel>
                    <FormDescription>Protect your website with Waytect security features.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Waytect Whitelist Paths</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendWaytect({ path: "" })}
                  disabled={!waytectForm.watch("waytectEnabled")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Path
                </Button>
              </div>
              <FormDescription>Add paths that should bypass Waytect protection.</FormDescription>

              {waytectFields.length === 0 && (
                <div className="text-sm text-muted-foreground py-4 text-center border rounded-md">
                  No whitelist paths added. All paths will be protected.
                </div>
              )}

              {waytectFields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-end gap-4">
                      <FormField
                        control={waytectForm.control}
                        name={`waytectPaths.${index}.path`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder="/api/public"
                                {...field}
                                disabled={!waytectForm.watch("waytectEnabled")}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeWaytect(index)}
                        disabled={!waytectForm.watch("waytectEnabled")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button type="submit" disabled={isWaytectLoading}>
              {isWaytectLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </TabsContent>
      <TabsContent value="firewall" className="mt-6">
        <Form {...firewallForm}>
          <form onSubmit={firewallForm.handleSubmit(onFirewallSubmit)} className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Firewall Rules (Regex Patterns)</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={() => appendFirewall({ pattern: "" })}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Rule
                </Button>
              </div>
              <FormDescription>
                Add regex patterns to block specific requests. For example, &quot;/admin/.*&quot; will block all
                requests to /admin/ paths.
              </FormDescription>

              {firewallFields.length === 0 && (
                <div className="text-sm text-muted-foreground py-4 text-center border rounded-md">
                  No firewall rules added. All requests will be allowed.
                </div>
              )}

              {firewallFields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-end gap-4">
                      <FormField
                        control={firewallForm.control}
                        name={`firewallRules.${index}.pattern`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="\/admin\/.*" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="outline" size="icon" onClick={() => removeFirewall(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button type="submit" disabled={isFirewallLoading}>
              {isFirewallLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  )
}
