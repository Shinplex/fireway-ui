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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Website name must be at least 2 characters.",
  }),
  domains: z
    .array(
      z.object({
        domain: z.string().min(3, {
          message: "Domain must be at least 3 characters.",
        }),
      }),
    )
    .min(1, {
      message: "At least one domain is required.",
    }),
  origins: z
    .array(
      z.object({
        host: z.string().min(1, {
          message: "Host is required.",
        }),
        protocol: z.enum(["http", "https"]),
        port: z.number().nullable(),
      }),
    )
    .optional(),
})

export function NewWebsiteForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      domains: [{ domain: "" }],
      origins: [{ host: "", protocol: "https", port: null }],
    },
  })

  const { 
    fields: domainFields, 
    append: appendDomain, 
    remove: removeDomain 
  } = useFieldArray({
    control: form.control,
    name: "domains",
  })

  const {
    fields: originFields,
    append: appendOrigin,
    remove: removeOrigin,
  } = useFieldArray({
    control: form.control,
    name: "origins",
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    const response = await fetch("/api/websites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    setIsLoading(false)

    if (!response.ok) {
      const error = await response.json()
      return toast({
        title: "Something went wrong.",
        description: error.error || "Your website could not be created. Please try again.",
        variant: "destructive",
      })
    }

    const data = await response.json()

    toast({
      title: "Website created!",
      description: "Your new CDN website has been created successfully.",
    })

    router.push(`/websites/${data.id}`)
    router.refresh()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
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

        {/* Domains Section */}
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
                    control={form.control}
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

        {/* Origins Section */}
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
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                      onClick={() => removeOrigin(index)}
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

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Website"}
        </Button>
      </form>
    </Form>
  )
}
