class DisableSSLRedirectForLocalhost:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Check if request is from localhost
        remote_addr = request.META.get('REMOTE_ADDR', '')
        if remote_addr in ['127.0.0.1', 'localhost', '::1']:
            # Temporarily disable SSL redirect for localhost
            request._dont_enforce_csrf_checks = False
            request.META['HTTP_X_FORWARDED_PROTO'] = 'https'
        
        response = self.get_response(request)
        return response
